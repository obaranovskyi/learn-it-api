import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { UserResponseModel } from '../src/user/model/user-response.model';
import { WorkspaceInput } from '../src/workspace/dto/workspace.input';
import { WorkspaceResponseModel } from '../src/workspace/model/workspace-response.model';
import { INVALID_ID } from './constants';
import { UserTestHelper } from './helper/user/user.helper';
import { WorkspaceTestHelper } from './helper/workspace/workspace.helper';
import { WorkspaceResolver } from '../src/workspace/resolver/workspace.resolver';
import { GqlResponseModel } from './models/gql-response.model';
import { toException } from './helper/common-gql.helper';
import { Validation } from '../src/shared/constants/validation.constants';

describe(`${WorkspaceResolver.name} (e2e)`, () => {
    const testHelper: WorkspaceTestHelper = new WorkspaceTestHelper();
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const workspaceInput: WorkspaceInput = {
        name: faker.company.name(),
    };
    let createdUser: UserResponseModel;
    let createdUser2: UserResponseModel;
    let createdWorkspace: WorkspaceResponseModel;
    let createdWorkspaceByUser2: WorkspaceResponseModel;

    beforeAll(async () => {
        createdUser = await userTestHelper.createUser(userTestHelper.getUniqUser('_1_'));
        createdUser2 = await userTestHelper.createUser(userTestHelper.getUniqUser('_2_'));
    });

    afterAll(async () => {
        await testHelper.removeWorkspace(createdWorkspaceByUser2.id, createdUser2.token);
        await userTestHelper.removeAllUsers([createdUser, createdUser2]);
    });

    it('should create new workspace', () => {
        return testHelper.createWorkspaceRequest(workspaceInput.name, createdUser.token).expect((res: GqlResponseModel) => {
            createdWorkspace = res.body.data.createWorkspace;

            expect(res.body.errors).toBeUndefined();
            expect(createdWorkspace.name).toEqual(workspaceInput.name);
            expect(createdWorkspace.id).toBeDefined();
            expect(createdWorkspace.ownerId).toEqual(createdUser.id);
            expect(createdWorkspace.ownerName).toEqual(createdUser.username);
            expect(createdWorkspace.created).toBeDefined();
            expect(createdWorkspace.updated).toBeDefined();
        });
    });

    it('should not create new workspace if name is empty', () => {
        return testHelper.createWorkspaceRequest('', createdUser.token).expect((res: GqlResponseModel) => {
            const { response, status } = toException(res);
            expect(res.body.data).toBeNull();
            expect(response).toBe('Validation failed: name should not be empty');
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    it('should not create new workspace if name is not unique', () => {
        return testHelper.createWorkspaceRequest(workspaceInput.name, createdUser.token).expect((res: GqlResponseModel) => {
            const { response, status } = toException(res);
            expect(res.body.data).toBeNull();
            expect(response).toBe(Validation.NOT_A_UNIQ);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    it('should create new workspace if name is unique in scope of one user', () => {
        return testHelper.createWorkspaceRequest(workspaceInput.name, createdUser2.token).expect((res: GqlResponseModel) => {
            createdWorkspaceByUser2 = res.body.data.createWorkspace;

            expect(res.body.errors).toBeUndefined();
            expect(createdWorkspaceByUser2.name).toEqual(workspaceInput.name);
            expect(createdWorkspaceByUser2.id).toBeDefined();
            expect(createdWorkspaceByUser2.ownerId).toEqual(createdUser2.id);
            expect(createdWorkspaceByUser2.ownerName).toEqual(createdUser2.username);
            expect(createdWorkspaceByUser2.created).toBeDefined();
            expect(createdWorkspaceByUser2.updated).toBeDefined();
        });
    });

    it('should return workspace list', () => {
        testHelper.findWorkspacesRequest(createdUser.token).expect((res: GqlResponseModel) => {
            expect(res.body.data.findAllWorkspaces).toContainEqual(createdWorkspace);
            expect(res.body.errors).toBeUndefined();
        });
    });

    it('should return workspace with given id', () => {
        return testHelper.findWorkspaceRequest(createdWorkspace.id, createdUser.token).expect((res: GqlResponseModel) => {
            createdWorkspace = res.body.data.findWorkspace;

            expect(createdWorkspace.name).toEqual(workspaceInput.name);
            expect(createdWorkspace.ownerId).toEqual(createdUser.id);
            expect(createdWorkspace.ownerName).toEqual(createdUser.username);
            expect(createdWorkspace.id).toBeDefined();
            expect(createdWorkspace.created).toBeDefined();
            expect(res.body.errors).toBeUndefined();
        });
    });

    it('should not return workspace if id is incorrect', () => {
        return testHelper.findWorkspaceRequest(INVALID_ID, createdUser.token).expect((res: GqlResponseModel) => {
            const { status, response } = toException(res);

            expect(res.body.data).toBeNull();
            expect(status).toBe(HttpStatus.NOT_FOUND);
            expect(response).toBe(Validation.NOT_FOUND);
        });
    });

    it('should update workspace name', () => {
        const newWorkspaceName = `${createdWorkspace.name} - updated`;

        return testHelper
            .updateWorkspaceRequest(newWorkspaceName, createdWorkspace.id, createdUser.token)
            .expect((res: GqlResponseModel) => {
                const previouslyCreatedWorkspace = createdWorkspace;
                createdWorkspace = res.body.data.updateWorkspace;

                expect(res.body.errors).toBeUndefined();

                expect(createdWorkspace.name).not.toEqual(previouslyCreatedWorkspace.name);
                expect(createdWorkspace.name).toEqual(newWorkspaceName);
                expect(createdWorkspace.id).toEqual(previouslyCreatedWorkspace.id);
                expect(createdWorkspace.ownerId).toEqual(previouslyCreatedWorkspace.ownerId);
                expect(createdWorkspace.ownerName).toEqual(previouslyCreatedWorkspace.ownerName);
                expect(createdWorkspace.created).toEqual(previouslyCreatedWorkspace.created);
                expect(createdWorkspace.updated).not.toEqual(previouslyCreatedWorkspace.updated);
            });
    });

    it('should not update workspace name if id is incorrect', () => {
        const newWorkspaceName = `${createdWorkspace.name} - updated`;

        return testHelper
            .updateWorkspaceRequest(newWorkspaceName, INVALID_ID, createdUser.token)
            .expect((res: GqlResponseModel) => {
                const { response, status } = toException(res);
                expect(res.body.data).toBeNull();
                expect(response).toBe(Validation.NOT_FOUND);
                expect(status).toBe(HttpStatus.NOT_FOUND);
            });
    });

    it('should remove workspace', () => {
        return testHelper.removeWorkspaceRequest(createdWorkspace.id, createdUser.token).expect((res: GqlResponseModel) => {
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data.removeWorkspace).toBe(createdWorkspace.id);
        });
    });

    it('should not remove workspace if id is incorrect', () => {
        return testHelper.removeWorkspaceRequest(INVALID_ID, createdUser.token).expect((res: GqlResponseModel) => {
            const { response, status } = toException(res);
            expect(res.body.data).toBeNull();
            expect(response).toBe(Validation.NOT_FOUND);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
