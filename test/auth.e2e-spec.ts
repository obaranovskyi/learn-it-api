import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AuthResolver } from '../src/user/resolver/auth.resolver';
import { UserTestHelper } from './helper/user/user.helper';
import { UserResponseModel } from '../src/user/model/user-response.model';
import {
    NO_NUMBER_ERROR_MESSAGE,
    NO_SPECIAL_CHARACTER_ERROR_MESSAGE,
    NO_CHARACTER_IN_LOWER_CASE_ERROR_MESSAGE,
    NO_CHARACTER_IN_UPPER_CASE_ERROR_MESSAGE,
    TO_SMALL_ERROR_MESSAGE,
} from '../src/shared/validators/error-messages.constant';
import { PasswordErrorCodes } from '../src/shared/validators/password-error-codes.enum';
import { toException } from './helper/common-gql.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { CredentialsValidation } from '../src/user/constants/credential-validation.constants';

describe(`${AuthResolver.name} (e2e)`, () => {
    const testHelper: UserTestHelper = new UserTestHelper();

    const userInput = testHelper.getUniqUser();
    let createdUser: UserResponseModel;

    afterAll(async () => {
        await testHelper.removeUser(createdUser.token);
    });

    it('should register user', () => {
        return testHelper.registerUserRequest(userInput).expect((res: GqlResponseModel) => {
            createdUser = res.body.data.register;

            expect(res.body.errors).toBeUndefined();
            expect(createdUser.token).toBeDefined();
            expect(createdUser.id).toBeDefined();
            expect(createdUser.created).toBeDefined();
            expect(createdUser.updated).toBeDefined();
            expect(createdUser.username).toEqual(userInput.username);
            expect(createdUser['password']).toBeUndefined();
        });
    });

    it('should not register new user if name already exist', () => {
        return testHelper.registerUserRequest(userInput).expect((res: GqlResponseModel) => {
            const { status } = toException(res);

            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    it('should not register user if password is incorrect: no numbers', () => {
        return testHelper
            .registerUserRequest({ username: 'UsernameIncorrect', password: '@InvalidPass' })
            .expect((res: GqlResponseModel) => {
                const { status, response } = toException(res);

                expect(status).toBe(HttpStatus.BAD_REQUEST);
                expect(response[0].code).toEqual(PasswordErrorCodes.NoNumber);
                expect(response[0].message).toEqual(NO_NUMBER_ERROR_MESSAGE);
            });
    });

    it('should not register user if password is incorrect: no special character', () => {
        return testHelper
            .registerUserRequest({ username: 'UsernameIncorrect', password: 'InvalidPass123' })
            .expect((res: GqlResponseModel) => {
                const { status, response } = toException(res);

                expect(status).toBe(HttpStatus.BAD_REQUEST);
                expect(response[0].code).toEqual(PasswordErrorCodes.NoSpecialCharacter);
                expect(response[0].message).toEqual(NO_SPECIAL_CHARACTER_ERROR_MESSAGE);
            });
    });

    it('should not register user if password is incorrect: no character in lower case', () => {
        return testHelper
            .registerUserRequest({ username: 'UsernameIncorrect', password: '@INVALIDPASS123' })
            .expect((res: GqlResponseModel) => {
                const { status, response } = toException(res);

                expect(status).toBe(HttpStatus.BAD_REQUEST);
                expect(response[0].code).toEqual(PasswordErrorCodes.NoCharacterInLowerCase);
                expect(response[0].message).toEqual(NO_CHARACTER_IN_LOWER_CASE_ERROR_MESSAGE);
            });
    });

    it('should not register user if password is incorrect: no character in upper case', () => {
        return testHelper
            .registerUserRequest({ username: 'UsernameIncorrect', password: '@invalidpass123' })
            .expect((res: GqlResponseModel) => {
                const { status, response } = toException(res);

                expect(status).toBe(HttpStatus.BAD_REQUEST);
                expect(response[0].code).toEqual(PasswordErrorCodes.NoCharacterInUpperCase);
                expect(response[0].message).toEqual(NO_CHARACTER_IN_UPPER_CASE_ERROR_MESSAGE);
            });
    });

    it('should not register user if password is incorrect: to small', () => {
        return testHelper
            .registerUserRequest({ username: 'UsernameIncorrect', password: '@iP123' })
            .expect((res: GqlResponseModel) => {
                const { status, response } = toException(res);

                expect(status).toBe(HttpStatus.BAD_REQUEST);
                expect(response[0].code).toEqual(PasswordErrorCodes.ToSmall);
                expect(response[0].message).toEqual(TO_SMALL_ERROR_MESSAGE);
            });
    });

    it('should login existing user', () => {
        return testHelper.loginUserRequest(userInput).expect((res: GqlResponseModel) => {
            createdUser = res.body.data.login;

            expect(createdUser.token).toBeDefined();
            expect(createdUser.id).toBeDefined();
            expect(createdUser.created).toBeDefined();
            expect(createdUser.updated).toBeDefined();
            expect(createdUser.username).toEqual(userInput.username);
            expect(createdUser['password']).toBeUndefined();
        });
    });

    it('should not login if user not registered', () => {
        return testHelper
            .loginUserRequest({
                username: faker.name.firstName(),
                password: userInput.password,
            })
            .expect((res: GqlResponseModel) => {
                const { response, status } = toException(res);
                expect(res.body.data).toBeNull();
                expect(response).toBe(CredentialsValidation.INVALID_USERNAME_PASSWORD);
                expect(status).toBe(HttpStatus.BAD_REQUEST);
            });
    });

    it('should not login if password is incorrect', () => {
        return testHelper
            .loginUserRequest({
                username: userInput.username,
                password: 'Invalid Password',
            })
            .expect((res: GqlResponseModel) => {
                const { response, status } = toException(res);

                expect(res.body.data).toBeNull();
                expect(response).toBe(CredentialsValidation.INVALID_USERNAME_PASSWORD);
                expect(status).toBe(HttpStatus.BAD_REQUEST);
            });
    });
});
