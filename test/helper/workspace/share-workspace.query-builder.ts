import * as gql from 'gql-query-builder';

import { ShareWorkspaceInput } from '../../../src/workspace/dto/share-workspace.input';
import { WorkspaceQueryBuilder } from './workspace.query-builder';
import { ShareWorkspaceRolesEnum } from 'src/workspace/enum/share-workspace-roles.enum';

export class ShareWorkspaceQueryBuilder {
    private static SHARE_workspace_FIELDS: string[] | any[] = [
        'id',
        'created',
        'updated',
        'roles',
        'userId',
        'username',
        'ownerId',
        'ownerName',
        { workspace: WorkspaceQueryBuilder.workspace_RESPONSE_MODEL_FIELDS },
    ];

    createShareWorkspaceMutation(shareWorkspaceInput: ShareWorkspaceInput): any {
        return gql.mutation({
            operation: 'createShareWorkspace',
            fields: ShareWorkspaceQueryBuilder.SHARE_workspace_FIELDS,
            variables: {
                shareWorkspaceInput: {
                    value: {
                        roles: shareWorkspaceInput.roles,
                        userId: shareWorkspaceInput.userId,
                        workspaceId: shareWorkspaceInput.workspaceId,
                    },
                    type: 'ShareWorkspaceInput',
                    required: true,
                },
            },
        });
    }

    updateShareWorkspaceRolesMutation(shareWorkspaceId: number, roles: ShareWorkspaceRolesEnum[]): any {
        return gql.mutation({
            operation: 'updateShareWorkspaceRoles',
            fields: ShareWorkspaceQueryBuilder.SHARE_workspace_FIELDS,
            variables: {
                shareWorkspaceId: {
                    value: shareWorkspaceId,
                    required: true,
                },
                roles: {
                    value: roles,
                    required: true,
                    type: '[ShareWorkspaceRolesEnum!]',
                },
            },
        });
    }

    findAllShareWorkspacesQuery(): any {
        return gql.query({
            operation: 'findAllShareWorkspaces',
            fields: ShareWorkspaceQueryBuilder.SHARE_workspace_FIELDS,
        });
    }

    findShareWorkspaceQuery(shareWorkspaceId: number): any {
        return gql.query({
            operation: 'findShareWorkspace',
            fields: ShareWorkspaceQueryBuilder.SHARE_workspace_FIELDS,
            variables: {
                shareWorkspaceId: {
                    value: shareWorkspaceId,
                    required: true,
                },
            },
        });
    }

    removeShareWorkspaceMutation(shareWorkspaceId: number): any {
        return gql.mutation({
            operation: 'removeShareWorkspace',
            variables: {
                shareWorkspaceId: {
                    value: shareWorkspaceId,
                    required: true,
                },
            },
        });
    }
}
