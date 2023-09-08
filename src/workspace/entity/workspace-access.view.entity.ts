import { ViewEntity, ViewColumn, DataSource } from 'typeorm';

import { ShareWorkspaceEntity } from './share-workspace.entity';
import { WorkspaceEntity } from './workspace.entity';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';
import { dbArrayToArray } from '../../shared/core/db.core';

@ViewEntity('workspace_access', {
    expression: (dataSource: DataSource) =>
        dataSource
            .createQueryBuilder()
            .select('workspaces.id', 'workspaceId')
            .addSelect('workspaces.owner.id', 'ownerId')
            .addSelect('share_workspaces.id', 'shareWorkspaceId')
            .addSelect('share_workspaces.user.id', 'shareWorkspaceUserId')
            .addSelect('share_workspaces.roles', 'roles')
            .from(WorkspaceEntity, 'workspaces')
            .leftJoin(ShareWorkspaceEntity, 'share_workspaces', 'share_workspaces.workspace.id = workspaces.id'),
})
export class WorkspaceAccessEntity {
    @ViewColumn()
    workspaceId: number;

    @ViewColumn()
    shareWorkspaceId?: number;

    @ViewColumn()
    ownerId: number;

    @ViewColumn()
    shareWorkspaceUserId: number;

    // INFO: actually return string like `{CAN_UPDATE,CAN_ADD_CONTENT}` etc
    // No possibility to mark database column as array with ViewColumn
    // More info here (Feature request): https://github.com/typeorm/typeorm/issues/6239
    @ViewColumn()
    roles?: ShareWorkspaceRolesEnum[];

    isAbleTo(userId: number, shareRoles: ShareWorkspaceRolesEnum | ShareWorkspaceRolesEnum[]): boolean {
        if (!Array.isArray(shareRoles)) {
            shareRoles = [shareRoles];
        }

        const roles = dbArrayToArray(this.roles);

        return (
            this.ownerId === userId ||
            roles.some((role: ShareWorkspaceRolesEnum) => {
                return shareRoles.includes(role);
            })
        );
    }
}
