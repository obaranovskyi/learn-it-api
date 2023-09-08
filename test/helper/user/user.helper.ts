import request from 'supertest';
import { faker } from '@faker-js/faker';

import { UserResponseModel } from '../../../src/user/model/user-response.model';
import { UserInput } from '../../../src/user/dto/user.input';
import { CreateUserTypeEnum } from '../../enums/create-user-type.enum';
import { gqlRequest } from '../common-gql.helper';
import { GqlResponseModel } from '../../models/gql-response.model';
import { UserQueryBuilder } from './user.query-builder';

export class UserTestHelper {
    private queryBuilder: UserQueryBuilder;

    public static USER_RESPONSE_MODEL_FIELDS: string[] = ['id', 'username', 'created', 'updated', 'token'];

    constructor() {
        this.queryBuilder = new UserQueryBuilder();
    }

    registerUserRequest(userInput: UserInput): request.Test {
        return this.createUserRequest(userInput, CreateUserTypeEnum.Register);
    }

    loginUserRequest(userInput: UserInput): request.Test {
        return this.createUserRequest(userInput, CreateUserTypeEnum.Login);
    }

    createUserRequest(userInput: UserInput, type: CreateUserTypeEnum): request.Test {
        return gqlRequest().send(this.queryBuilder.createUserMutation(userInput, type));
    }

    findAllUsersRequest(token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.findAllUsersQuery());
    }

    removeUserRequest(token: string): request.Test {
        return gqlRequest(token).send(this.queryBuilder.removeUserMutation());
    }

    async createUser(userInput: UserInput = this.getUniqUser()): Promise<UserResponseModel> {
        return this.registerUserRequest(userInput).then((res: GqlResponseModel) => res.body.data.register);
    }

    async removeUser(token: string): Promise<number> {
        return this.removeUserRequest(token).then((res: GqlResponseModel) => res.body.data.removeUser);
    }

    async removeAllUsers(users: UserResponseModel[]): Promise<number[]> {
        return Promise.all(
            users.map((user: UserResponseModel) => {
                return this.removeUser(user.token);
            })
        );
    }

    getUniqUser(suffix: string = ''): UserInput {
        const suffixWithUnderscore = suffix ? `_${suffix}` : suffix;

        return {
            username: `${faker.name.firstName()}_${Date.now()}${suffixWithUnderscore}`,
            password: '@ValidPass123',
        };
    }
}
