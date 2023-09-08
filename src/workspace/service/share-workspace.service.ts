import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { WorkspaceEntity } from '../entity/workspace.entity';
import { ShareWorkspaceEntity } from '../entity/share-workspace.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { ShareWorkspaceInput } from '../dto/share-workspace.input';
import { ShareWorkspaceResponseModel } from '../model/share-workspace-response.model';
import { CustomShareWorkspaceRepository } from '../repository/custom-share-workspace.repository';
import { Validation } from '../../shared/constants/validation.constants';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';

@Injectable()
export class ShareWorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity) private readonly workspaceRepository: Repository<WorkspaceEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ShareWorkspaceEntity) private readonly shareWorkspaceRepository: Repository<ShareWorkspaceEntity>,
        private readonly customShareWorkspaceRepository: CustomShareWorkspaceRepository
    ) {}

    async findOne(userId: number, shareWorkspaceId: number): Promise<ShareWorkspaceResponseModel> {
        const shareWorkspace = await this.customShareWorkspaceRepository.getIfAvailableForUserWithId(userId, shareWorkspaceId);

        if (!shareWorkspace) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        return shareWorkspace.toResponseObject();
    }

    async findAll(userId: number): Promise<ShareWorkspaceResponseModel[]> {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        if (!user) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        const sharedWorkspaces = await this.shareWorkspaceRepository.find({ where: { user: { id: userId } } });

        return sharedWorkspaces.map((sharedWorkspace: ShareWorkspaceEntity) => {
            return sharedWorkspace.toResponseObject();
        });
    }

    async updateRoles(
        ownerId: number,
        roles: ShareWorkspaceRolesEnum[],
        shareWorkspaceId: number
    ): Promise<ShareWorkspaceResponseModel> {
        const shareWorkspace = await this.shareWorkspaceRepository.findOne({ where: { id: shareWorkspaceId }});

        if (!shareWorkspace) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        if (!shareWorkspace.isOwner(ownerId)) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        shareWorkspace.roles = roles;

        const updatedShareWorkspace = await this.shareWorkspaceRepository.save(shareWorkspace);

        return updatedShareWorkspace.toResponseObject();
    }

    async remove(userId: number, id: number): Promise<DeleteResult> {
        const sharedWorkspace = await this.shareWorkspaceRepository.findOne({ where: { id }});
        if (!sharedWorkspace) throw new HttpException(Validation.NOT_FOUND, HttpStatus.NOT_FOUND);

        if (!sharedWorkspace.canBeRemovedBy(userId))
            throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        return this.shareWorkspaceRepository.delete(id);
    }

    async create(ownerId: number, shareWorkspaceInput: ShareWorkspaceInput): Promise<ShareWorkspaceResponseModel> {
        const workspace = await this.workspaceRepository.findOne({ where: { id: shareWorkspaceInput.workspaceId } });
        if (!workspace) throw new HttpException(Validation.NOT_FOUND, HttpStatus.NOT_FOUND);

        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        if (owner.id !== ownerId) throw new HttpException(Validation.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

        const user = await this.userRepository.findOne({ where: { id: shareWorkspaceInput.userId } });

        const createdShareWorkspace = this.shareWorkspaceRepository.create({ workspace, user, roles: shareWorkspaceInput.roles });
        await this.shareWorkspaceRepository.save(createdShareWorkspace);

        return { ...createdShareWorkspace.toResponseObject() };
    }
}
