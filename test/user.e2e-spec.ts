import { HttpStatus } from '@nestjs/common';

import { UserResponseModel } from '../src/user/model/user-response.model';
import { UserTestHelper } from './helper/user/user.helper';
import { UserInput } from '../src/user/dto/user.input';
import { UserResolver } from '../src/user/resolver/user.resolver';
import { GqlResponseModel } from './models/gql-response.model';
import { toException } from './helper/common-gql.helper';
import { Jwt } from '../src/shared/constants/jwt.constants';

describe(`${UserResolver.name} (e2e)`, () => {
    const testHelper: UserTestHelper = new UserTestHelper();
    const invalidToken: string = 'Invalid token';
    const userInput: UserInput = testHelper.getUniqUser();
    let createdUser: UserResponseModel;

    beforeAll(async () => {
        createdUser = await testHelper.createUser(userInput);
    });

    afterAll(async () => {
        await testHelper.removeUserRequest(createdUser.token);
    });

    it('should return user list', () => {
        return testHelper.findAllUsersRequest(createdUser.token).expect((res: GqlResponseModel) => {
            const users = res.body.data.findAllUsers;
            const currCreatedUser = users.find((user: UserResponseModel) => {
                return user.id === createdUser.id;
            });
            const createdUserWithoutToken = {
                created: createdUser.created,
                updated: createdUser.updated,
                username: createdUser.username,
                id: createdUser.id,
            };

            expect(Array.isArray(users)).toBeTruthy();
            expect(currCreatedUser).toMatchObject(createdUserWithoutToken);
        });
    });

    it('should remove user', () => {
        return testHelper.removeUserRequest(createdUser.token).expect((res: GqlResponseModel) => {
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data.removeUser).toBe(createdUser.id);
        });
    });

    it('should not remove user with wrong token', () => {
        return testHelper.removeUserRequest(invalidToken).expect((res: GqlResponseModel) => {
            const { status, response } = toException(res);

            expect(res.body.data).toBeNull();
            expect(status).toBe(HttpStatus.UNAUTHORIZED);
            expect(response).toBe(Jwt.INVALID_TOKEN);
        });
    });
});
