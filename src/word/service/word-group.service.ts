import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { WordGroupInput } from '../dto/word-group.input';
import { WordGroupResponseModel } from '../model/word-group-response.model';
import { CustomWordGroupRepository } from '../repository/custom-word-group.repository';
import { WorkspaceEntity } from '../../workspace/entity/workspace.entity';
import { Validation } from '../../shared/constants/validation.constants';
import { ShareWorkspaceRolesEnum, getAllShareWorkspaceRoles } from '../../workspace/enum/share-workspace-roles.enum';
import { CustomWorkspaceAccessRepository } from '../../workspace/repository/custom-workspace-access.repository';
import { ExistingWordGroupInput } from '../dto/existing-word-group.input';
import { WordGroupEntity } from '../entity/word-group.entity';
import { RemoveWordGroupInput } from '../dto/remove-word-group.input';

@Injectable()
export class WordGroupService {
    constructor(
        @InjectRepository(WorkspaceEntity) private readonly workspaceRepository: Repository<WorkspaceEntity>,
        @InjectRepository(WordGroupEntity) private readonly wordGroupRepository: Repository<WordGroupEntity>,
        private readonly customWordGroupRepository: CustomWordGroupRepository,
        private readonly customWorkspaceAccessRepository: CustomWorkspaceAccessRepository
    ) {}

    async findOne(wordGroupId: number, userId: number): Promise<WordGroupResponseModel> {
        const wordGroup = await this.getWordGroupOrThrowBadRequest(wordGroupId);
        const wordGroupResponseModel = wordGroup.toResponseObject();

        await this.verifyRightsOrThrowUnauthorized(wordGroupResponseModel.workspaceId, userId, getAllShareWorkspaceRoles());

        return wordGroupResponseModel;
    }

    async findAll(workspaceId: number, userId: number): Promise<WordGroupResponseModel[]> {
        await this.getWorkspaceOrThrowBadRequest(workspaceId);

        await this.verifyRightsOrThrowUnauthorized(workspaceId, userId, getAllShareWorkspaceRoles());

        const wordGroups = await this.wordGroupRepository.find({ where: { workspace: { id: workspaceId } } });

        return wordGroups.map((wordGroup: WordGroupEntity) => {
            return wordGroup.toResponseObject();
        });
    }

    async create({ workspaceId, groupName }: WordGroupInput, userId: number): Promise<WordGroupResponseModel> {
        const workspace = await this.getWorkspaceOrThrowBadRequest(workspaceId);

        await this.verifyRightsOrThrowUnauthorized(workspaceId, userId, ShareWorkspaceRolesEnum.CAN_ADD_CONTENT);

        await this.throwBadRequestIfNameReserved(workspaceId, groupName);

        const createdWordGroup = this.wordGroupRepository.create({ name: groupName, workspace });
        await this.wordGroupRepository.save(createdWordGroup);

        return createdWordGroup.toResponseObject();
    }

    async update(wordGroup: ExistingWordGroupInput, userId: number): Promise<WordGroupResponseModel> {
        await this.getWorkspaceOrThrowBadRequest(wordGroup.workspaceId);

        await this.verifyRightsOrThrowUnauthorized(wordGroup.workspaceId, userId, ShareWorkspaceRolesEnum.CAN_UPDATE_CONTENT);

        await this.throwBadRequestIfNameReserved(wordGroup.workspaceId, wordGroup.groupName);

        const existingWordGroup = await this.getWordGroupOrThrowBadRequest(wordGroup.wordGroupId);
        const updatedWordGroup = this.wordGroupRepository.merge(existingWordGroup, { name: wordGroup.groupName });
        await this.wordGroupRepository.save(updatedWordGroup);

        return updatedWordGroup.toResponseObject();
    }

    async remove({ workspaceId, wordGroupId }: RemoveWordGroupInput, userId: number): Promise<DeleteResult> {
        // TODO: To test
        const wordGroup = await this.wordGroupRepository.findOne({ where: { id: wordGroupId }});
        // const wordGroup = await this.wordGroupRepository.findOne(wordGroupId);
        if (!wordGroup) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        await this.verifyRightsOrThrowUnauthorized(workspaceId, userId, ShareWorkspaceRolesEnum.CAN_REMOVE_CONTENT);

        return this.wordGroupRepository.delete(wordGroupId);
    }

    async throwBadRequestIfNameReserved(workspaceId: number, groupName: string): Promise<void | never> {
        if (await this.customWordGroupRepository.isNameUniq(groupName, workspaceId))
            throw new HttpException(Validation.NOT_A_UNIQ, HttpStatus.BAD_REQUEST);
    }

    async verifyRightsOrThrowUnauthorized(
        workspaceId: number,
        userId: number,
        roles: ShareWorkspaceRolesEnum | ShareWorkspaceRolesEnum[]
    ): Promise<void | never> {
        const isUserAbleTo = await this.customWorkspaceAccessRepository.isUserAbleTo(userId, workspaceId, roles);

        if (!isUserAbleTo) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    private async getWorkspaceOrThrowBadRequest(workspaceId: number): Promise<WorkspaceEntity | never> {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId }});

        if (!workspace) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        return workspace;
    }

    async getWordGroupOrThrowBadRequest(wordGroupId: number): Promise<WordGroupEntity | never> {
        const wordGroup = await this.wordGroupRepository.findOne({ where: { id: wordGroupId }});

        if (!wordGroup) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        return wordGroup;
    }
}
