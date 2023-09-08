import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WorkspaceAccessEntity } from '../entity/workspace-access.view.entity';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';


@Injectable()
export class CustomWorkspaceAccessRepository {

    constructor(
      @InjectRepository(WorkspaceAccessEntity) private readonly workspaceAccessRepository: Repository<WorkspaceAccessEntity>
    ) { }

    async isUserAbleTo(
        userId: number,
        workspaceId: number,
        roles: ShareWorkspaceRolesEnum | ShareWorkspaceRolesEnum[]
    ): Promise<boolean> {
        const workspaceAccessList = await this.workspaceAccessRepository.find({
            where: [
                { workspaceId, shareWorkspaceUserId: userId },
                { workspaceId, ownerId: userId },
            ],
        });

        return workspaceAccessList.some((workspaceAccess: WorkspaceAccessEntity) => {
            return workspaceAccess.isAbleTo(userId, roles);
        });
    }
}
