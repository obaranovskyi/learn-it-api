import * as gql from 'gql-query-builder';

import { UserInput } from '../../../src/user/dto/user.input';
import { CreateUserTypeEnum } from '../../enums/create-user-type.enum';

export class UserQueryBuilder {
    public static USER_RESPONSE_MODEL_FIELDS: string[] = ['id', 'username', 'created', 'updated', 'token'];

    createUserMutation(userInput: UserInput, type: CreateUserTypeEnum): any {
        return gql.mutation({
            operation: type,
            fields: UserQueryBuilder.USER_RESPONSE_MODEL_FIELDS,
            variables: {
                userInput: {
                    value: userInput,
                    type: 'UserInput',
                    required: true,
                },
            },
        });
    }

    findAllUsersQuery(): any {
        return gql.query({
            operation: 'findAllUsers',
            fields: UserQueryBuilder.USER_RESPONSE_MODEL_FIELDS,
        });
    }

    removeUserMutation(): any {
        return gql.mutation({ operation: 'removeUser' });
    }
}
