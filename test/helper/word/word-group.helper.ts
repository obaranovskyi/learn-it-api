import request from 'supertest';

import { WordGroupQueryBuilder } from './word-group.query-builder';
import { gqlRequest } from '../common-gql.helper';
import { GqlResponseModel } from '../../models/gql-response.model';
import { WordGroupResponseModel } from '../../../src/word/model/word-group-response.model';

export class WordGroupTestHelper {
    private queryBuilder: WordGroupQueryBuilder;

    constructor() {
        this.queryBuilder = new WordGroupQueryBuilder();
    }

    async createWordGroup(workspaceId: number, token: string): Promise<WordGroupResponseModel> {
        return this.createWordGroupRequest(workspaceId, token).then(
            (res: GqlResponseModel) => res.body.data.createWordGroup
        );
    }

    findWordGroupRequest(wordGroupId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWordGroupQuery(wordGroupId));
    }

    findWordGroupsRequest(wordGroupId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWordGroupsQuery(wordGroupId));
    }

    createWordGroupRequest(
        workspaceId: number,
        token: string,
        wordGroupName: string = `Word Group Name - ${Date.now()}`
    ): request.Test {
        return gqlRequest(token).send(this.queryBuilder.createWordGroupMutation(workspaceId, wordGroupName));
    }

    updateWordGroupRequest(wordGroupId: number, workspaceId: number, newGroupName: string, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.updateWordGroupMutation(wordGroupId, workspaceId, newGroupName));
    }

    removeWordGroupRequest(wordGroupId: number, workspaceId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.removeWordGroupMutation(wordGroupId, workspaceId));
    }
}
