import * as gql from 'gql-query-builder';

export class WordGroupQueryBuilder {
    public static WORD_GROUP_RESPONSE_MODEL_FIELDS: string[] = [
        'id',
        'created',
        'updated',
        'name',
        'workspaceId',
        'workspaceOwnerId',
        'workspaceOwnerName',
    ];

    findWordGroupQuery(wordGroupId: number): any {
        return gql.query({
            operation: 'findWordGroup',
            fields: WordGroupQueryBuilder.WORD_GROUP_RESPONSE_MODEL_FIELDS,
            variables: {
                wordGroupId: {
                    value: wordGroupId,
                    required: true,
                },
            },
        });
    }

    findWordGroupsQuery(workspaceId: number): any {
        return gql.query({
            operation: 'findWordGroups',
            fields: WordGroupQueryBuilder.WORD_GROUP_RESPONSE_MODEL_FIELDS,
            variables: {
                workspaceId: {
                    value: workspaceId,
                    required: true,
                },
            },
        });
    }

    createWordGroupMutation(workspaceId: number, groupName: string): any {
        return gql.mutation({
            operation: 'createWordGroup',
            fields: WordGroupQueryBuilder.WORD_GROUP_RESPONSE_MODEL_FIELDS,
            variables: {
                wordGroupInput: {
                    value: {
                        workspaceId,
                        groupName,
                    },
                    type: 'WordGroupInput',
                    required: true,
                },
            },
        });
    }

    updateWordGroupMutation(wordGroupId: number, workspaceId: number, groupName: string): any {
        return gql.mutation({
            operation: 'updateWordGroup',
            fields: WordGroupQueryBuilder.WORD_GROUP_RESPONSE_MODEL_FIELDS,
            variables: {
                wordGroupInput: {
                    value: {
                        wordGroupId,
                        workspaceId,
                        groupName,
                    },
                    type: 'ExistingWordGroupInput',
                    required: true,
                },
            },
        });
    }

    removeWordGroupMutation(wordGroupId: number, workspaceId: number): any {
        return gql.mutation({
            operation: 'removeWordGroup',
            variables: {
                removeWordGroupInput: {
                    value: {
                        wordGroupId,
                        workspaceId,
                    },
                    type: 'RemoveWordGroupInput',
                    required: true,
                },
            },
        });
    }
}
