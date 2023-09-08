import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShareWorkspaceEntity } from '../entity/share-workspace.entity';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';

@Injectable()
export class CustomShareWorkspaceRepository {

    constructor(
      @InjectRepository(ShareWorkspaceEntity) private readonly shareWorkspaceRepository: Repository<ShareWorkspaceEntity>
    ) {}

    async isUserWithRole(userId: number, workspaceId: number, role: ShareWorkspaceRolesEnum): Promise<boolean> {
        const shareWorkspace = await this.shareWorkspaceRepository.findOne({
            where: { user: { id: userId }, workspace: { id: workspaceId } },
        });

        return Boolean(shareWorkspace) && shareWorkspace.roles.includes(role);
    }

    async getIfAvailableForUserWithId(userId: number, shareWorkspaceId: number): Promise<ShareWorkspaceEntity> {
        const shareWorkspace = await this.shareWorkspaceRepository.findOne({ where: { id: shareWorkspaceId }});

        if (!shareWorkspace) return;

        const isUserOwner = shareWorkspace.workspace.owner.id === userId;
        const isSharedWithUser = shareWorkspace.user.id === userId;

        return isUserOwner || isSharedWithUser ? shareWorkspace : undefined;
    }
}
