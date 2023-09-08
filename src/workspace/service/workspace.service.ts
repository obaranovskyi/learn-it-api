import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { WorkspaceEntity } from '../entity/workspace.entity';
import { WorkspaceInput } from '../dto/workspace.input';
import { UserEntity } from '../../user/entity/user.entity';
import { WorkspaceResponseModel } from '../model/workspace-response.model';
import { Validation } from '../../shared/constants/validation.constants';
import { CustomWorkspaceAccessRepository } from '../repository/custom-workspace-access.repository';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity) private readonly workspaceRepository: Repository<WorkspaceEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly customWorkspaceAccessRepository: CustomWorkspaceAccessRepository
    ) {}

    async findAll(ownerId: number): Promise<WorkspaceResponseModel[]> {
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        const workspaces = await this.workspaceRepository.find({ relations: ['owner'], where: { owner: { id: owner.id } } });

        return workspaces.map((workspace) => workspace.toResponseObject());
    }

    async findOne(ownerId: number, id: number): Promise<WorkspaceResponseModel> {
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        const workspace = await this.workspaceRepository.findOne({ relations: ['owner'], where: { id, owner: { id: owner.id} } });

        if (!workspace) throw new HttpException(Validation.NOT_FOUND, HttpStatus.NOT_FOUND);

        return workspace.toResponseObject();
    }

    async create(ownerId: number, workspaceDto: WorkspaceInput): Promise<WorkspaceResponseModel> {
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        const exists = await this.workspaceRepository.findOne({
            where: { name: workspaceDto.name, owner: { id: owner.id } },
        });
        if (exists) throw new HttpException(Validation.NOT_A_UNIQ, HttpStatus.BAD_REQUEST);

        const newWorkspace = this.workspaceRepository.create({ ...workspaceDto, owner });
        await this.workspaceRepository.save(newWorkspace);

        return newWorkspace.toResponseObject();
    }

    async remove(userId: number, id: number): Promise<DeleteResult> {
        const workspace = await this.workspaceRepository.findOne({ relations: ['owner'], where: { id } });
        if (!workspace) throw new HttpException(Validation.NOT_FOUND, HttpStatus.NOT_FOUND);

        const isUserAbleToUpdate = await this.customWorkspaceAccessRepository.isUserAbleTo(
            userId,
            workspace.id,
            ShareWorkspaceRolesEnum.CAN_REMOVE
        );

        if (!isUserAbleToUpdate) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        return this.workspaceRepository.delete(id);
    }

    async update(userId: number, workspaceId: number, partialWorkspace: Partial<WorkspaceInput>): Promise<WorkspaceEntity> {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId }});
        if (!workspace) throw new HttpException(Validation.NOT_FOUND, HttpStatus.NOT_FOUND);

        const isUserAbleToUpdate = await this.customWorkspaceAccessRepository.isUserAbleTo(
            userId,
            workspace.id,
            ShareWorkspaceRolesEnum.CAN_UPDATE
        );

        if (!isUserAbleToUpdate) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        this.workspaceRepository.merge(workspace, partialWorkspace);

        return this.workspaceRepository.save(workspace);
    }
}
