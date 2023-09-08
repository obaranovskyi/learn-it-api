import request from 'supertest';

import { WorkspaceResponseModel } from 'src/workspace/model/workspace-response.model';
import { GqlResponseModel } from '../../models/gql-response.model';
import { gqlRequest } from './../common-gql.helper';

import { WorkspaceQueryBuilder } from './workspace.query-builder';

export class WorkspaceTestHelper {
    queryBuilder: WorkspaceQueryBuilder;

    constructor() {
        this.queryBuilder = new WorkspaceQueryBuilder();
    }
    async createWorkspace(token: string, workspaceName: string = `WorkspaceName - ${Date.now()}`): Promise<WorkspaceResponseModel> {
        return this.createWorkspaceRequest(workspaceName, token).then((res: GqlResponseModel) => res.body.data.createWorkspace);
    }

    async removeWorkspace(workspaceId: number, token: string): Promise<WorkspaceResponseModel> {
        return this.removeWorkspaceRequest(workspaceId, token).then((res: GqlResponseModel) => res.body.data.removeWorkspace);
    }

    createWorkspaceRequest(workspaceName: string, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.createWorkspaceMutation(workspaceName));
    }

    findWorkspaceRequest(workspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWorkspaceQuery(workspaceId));
    }

    findWorkspacesRequest(token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWorkspacesQuery());
    }

    updateWorkspaceRequest(workspaceName: string, workspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.updateWorkspaceMutation(workspaceName, workspaceId));
    }

    removeWorkspaceRequest(workspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.removeWorkspaceMutation(workspaceId));
    }
}
