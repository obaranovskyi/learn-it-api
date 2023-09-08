import request from 'supertest';

import { gqlRequest } from '../../helper/common-gql.helper';
import { ShareWorkspaceInput } from '../../../src/workspace/dto/share-workspace.input';
import { getAllShareWorkspaceRoles, ShareWorkspaceRolesEnum } from '../../../src/workspace/enum/share-workspace-roles.enum';
import { ShareWorkspaceResponseModel } from '../../../src/workspace/model/share-workspace-response.model';
import { GqlResponseModel } from '../../models/gql-response.model';
import { ShareWorkspaceQueryBuilder } from './share-workspace.query-builder';

export class ShareWorkspaceTestHelper {
    private queryBuilder: ShareWorkspaceQueryBuilder;

    constructor() {
        this.queryBuilder = new ShareWorkspaceQueryBuilder();
    }

    async createShareWorkspace(
        ownerToken: string,
        userId: number,
        workspaceId: number,
        roles: ShareWorkspaceRolesEnum[] = [ShareWorkspaceRolesEnum.CAN_VIEW]
    ): Promise<ShareWorkspaceResponseModel> {
        const shareWorkspaceInput = {
            roles,
            userId,
            workspaceId,
        };
        return this.createShareWorkspaceRequest(shareWorkspaceInput, ownerToken).then(
            (res: GqlResponseModel) => res.body.data.createShareWorkspace
        );
    }

    async createShareWorkspaceWithAllRoles(
        ownerToken: string,
        userId: number,
        workspaceId: number
    ): Promise<ShareWorkspaceResponseModel> {
        return this.createShareWorkspaceRequest(
            {
                roles: getAllShareWorkspaceRoles(),
                userId,
                workspaceId,
            },
            ownerToken
        ).then((res: GqlResponseModel) => res.body.data.createShareWorkspace);
    }

    createShareWorkspaceRequest(shareWorkspaceInput: ShareWorkspaceInput, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.createShareWorkspaceMutation(shareWorkspaceInput));
    }

    findAllShareWorkspacesRequest(token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findAllShareWorkspacesQuery());
    }

    updateShareWorkspaceRolesRequest(shareWorkspaceId: number, roles: ShareWorkspaceRolesEnum[], token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.updateShareWorkspaceRolesMutation(shareWorkspaceId, roles));
    }

    findShareWorkspaceRequest(shareWorkspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findShareWorkspaceQuery(shareWorkspaceId));
    }

    removeShareWorkspaceRequest(shareWorkspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.removeShareWorkspaceMutation(shareWorkspaceId));
    }
}
