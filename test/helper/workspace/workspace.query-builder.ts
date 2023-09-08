import * as gql from 'gql-query-builder';

export class WorkspaceQueryBuilder {
    public static workspace_RESPONSE_MODEL_FIELDS: string[] = ['id', 'name', 'created', 'updated', 'ownerId', 'ownerName'];

    findWorkspacesQuery(): any {
        return gql.query({
            operation: 'findAllWorkspaces',
            fields: WorkspaceQueryBuilder.workspace_RESPONSE_MODEL_FIELDS,
        });
    }

    findWorkspaceQuery(workspaceId: number): any {
        return gql.query({
            operation: 'findWorkspace',
            fields: WorkspaceQueryBuilder.workspace_RESPONSE_MODEL_FIELDS,
            variables: {
                workspaceId: {
                    value: workspaceId,
                    required: true,
                },
            },
        });
    }

    updateWorkspaceMutation(workspaceName: string, workspaceId: number): any {
        return gql.mutation({
            operation: 'updateWorkspace',
            fields: WorkspaceQueryBuilder.workspace_RESPONSE_MODEL_FIELDS,
            variables: {
                workspaceInput: {
                    value: {
                        name: workspaceName,
                    },
                    type: 'WorkspaceInput',
                    required: true,
                },
                id: {
                    value: workspaceId,
                    required: true,
                },
            },
        });
    }

    removeWorkspaceMutation(workspaceId: number): any {
        return gql.mutation({
            operation: 'removeWorkspace',
            variables: {
                workspaceId: {
                    value: workspaceId,
                    required: true,
                },
            },
        });
    }

    createWorkspaceMutation(workspaceName: string): any {
        return gql.mutation({
            operation: 'createWorkspace',
            fields: WorkspaceQueryBuilder.workspace_RESPONSE_MODEL_FIELDS,
            variables: {
                workspaceInput: {
                    value: {
                        name: workspaceName,
                    },
                    type: 'WorkspaceInput',
                    required: true,
                },
            },
        });
    }
}
