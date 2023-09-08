import request from 'supertest';

import { gqlRequest } from '../common-gql.helper';
import { StatsQueryBuilder } from './stats.query-builder';
import { WordTestInput } from '../../../src/stats/dto/word-test.input';

export class StatsTestHelper {
    private queryBuilder: StatsQueryBuilder;

    constructor() {
        this.queryBuilder = new StatsQueryBuilder();
    }

    createWordTestRequest(wordTestInput: WordTestInput, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.createWordTestMutation(wordTestInput));
    }
}
