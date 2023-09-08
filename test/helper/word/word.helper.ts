import request from 'supertest';

import { WordQueryBuilder } from './word.query-builder';
import { gqlRequest } from '../common-gql.helper';
import { WordInput } from 'src/word/dto/word.input';
import { ExistingWordInput } from 'src/word/dto/existing-word.input';
import { WordResponseModel } from 'src/word/model/word-response.model';
import { GqlResponseModel } from 'test/models/gql-response.model';

export class WordTestHelper {
    private queryBuilder: WordQueryBuilder;

    constructor() {
        this.queryBuilder = new WordQueryBuilder();
    }

    async createWord(wordInput: WordInput, token: string): Promise<WordResponseModel> {
        return this.createWordRequest(wordInput, token).then((res: GqlResponseModel) => res.body.data.createWord);
    }

    findWordRequest(wordId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWordQuery(wordId));
    }

    findWordsRequest(wordGroupId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findWordsQuery(wordGroupId));
    }

    createWordRequest(wordInput: WordInput, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.createWordMutation(wordInput));
    }

    updateWordRequest(wordInput: ExistingWordInput, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.updateWordMutation(wordInput));
    }

    removeWordRequest(wordId: number, token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.removeWordMutation(wordId));
    }
}
