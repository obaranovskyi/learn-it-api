import * as gql from 'gql-query-builder';

import { WordTestInput } from '../../../src/stats/dto/word-test.input';

export class StatsQueryBuilder {
    createWordTestMutation(wordTestInput: WordTestInput): any {
        return gql.mutation({
            operation: 'createWordTest',
            variables: {
                wordTestInput: {
                    value: { ...wordTestInput },
                    type: 'WordTestInput',
                    required: true,
                },
            },
        });
    }
}
