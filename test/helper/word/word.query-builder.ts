import * as gql from 'gql-query-builder';

import { WordInput } from '../../../src/word/dto/word.input';

import { ExistingWordInput } from 'src/word/dto/existing-word.input';

export class WordQueryBuilder {
    public static WORD_RESPONSE_MODEL_FIELDS: string[] = [
        'id',
        'created',
        'updated',
        'value',
        'description',
        'translation',
        'examples',
    ];

    findWordQuery(wordId: number): any {
        return gql.query({
            operation: 'findWord',
            fields: WordQueryBuilder.WORD_RESPONSE_MODEL_FIELDS,
            variables: {
                wordId: {
                    value: wordId,
                    required: true,
                },
            },
        });
    }

    findWordsQuery(wordGroupId: number): any {
        return gql.query({
            operation: 'findWords',
            fields: WordQueryBuilder.WORD_RESPONSE_MODEL_FIELDS,
            variables: {
                wordGroupId: {
                    value: wordGroupId,
                    required: true,
                },
            },
        });
    }

    createWordMutation(wordInput: WordInput): any {
        return gql.mutation({
            operation: 'createWord',
            fields: WordQueryBuilder.WORD_RESPONSE_MODEL_FIELDS,
            variables: {
                wordInput: {
                    value: { ...wordInput },
                    type: 'WordInput',
                    required: true,
                },
            },
        });
    }

    updateWordMutation(wordInput: ExistingWordInput): any {
        return gql.mutation({
            operation: 'updateWord',
            fields: WordQueryBuilder.WORD_RESPONSE_MODEL_FIELDS,
            variables: {
                wordInput: {
                    value: { ...wordInput },
                    type: 'ExistingWordInput',
                    required: true,
                },
            },
        });
    }

    removeWordMutation(wordId: number): any {
        return gql.mutation({
            operation: 'removeWord',
            variables: {
                wordId: {
                    value: wordId,
                    required: true,
                },
            },
        });
    }
}
