import request from 'supertest';

import { UserTestHelper } from './helper/user/user.helper';
import { WorkspaceTestHelper } from './helper/workspace/workspace.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { cannotBeDone } from './helper/common-gql.helper';
import { WorkspaceAccessFactory } from './helper/workspace/workspace-access.factory';
import { WorkspaceAccessFactoryModel } from './models/workspace-access-factory.model';

describe(`WorkspaceAccess (e2e)`, () => {
    const workspaceTestHelper: WorkspaceTestHelper = new WorkspaceTestHelper();
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const workspaceAccessFactory: WorkspaceAccessFactory = new WorkspaceAccessFactory();
    let tc: WorkspaceAccessFactoryModel;

    const updateWorkspaceTest = (token: string): request.Test => {
        const updatedWorkspaceName = `${tc.workspace.name}_${Date.now()}`;

        return workspaceTestHelper.updateWorkspaceRequest(updatedWorkspaceName, tc.workspace.id, token).expect(cannotBeDone);
    };

    const removeWorkspaceTest = (token: string): request.Test => {
        return workspaceTestHelper.removeWorkspaceRequest(tc.workspace.id, token).expect(cannotBeDone);
    };

    beforeAll(async () => {
        await workspaceAccessFactory.init();

        tc = workspaceAccessFactory.toTestContent();
    });

    afterAll(async () => {
        await userTestHelper.removeAllUsers(workspaceAccessFactory.toUsers());
    });

    it(`user with NO role can't update workspace`, () => {
        return updateWorkspaceTest(tc.noRolesUser.token);
    });

    it(`user with CAN_VIEW role can't update workspace`, () => {
        return updateWorkspaceTest(tc.viewUser.token);
    });

    it(`user with CAN_REMOVE role can't update workspace`, () => {
        return updateWorkspaceTest(tc.removeUser.token);
    });

    it(`user with CAN_ADD_CONTENT role can't update workspace`, () => {
        return updateWorkspaceTest(tc.addContentUser.token);
    });

    it(`user with CAN_REMOVE_CONTENT role can't update workspace`, () => {
        return updateWorkspaceTest(tc.removeContentUser.token);
    });

    it(`user with CAN_UPDATE_CONTENT role can't update workspace`, () => {
        return updateWorkspaceTest(tc.updateContentUser.token);
    });

    it(`user with CAN_UPDATE role can update workspace`, () => {
        const updatedWorkspaceName = `${tc.workspace.name}_${Date.now()}`;

        return workspaceTestHelper
            .updateWorkspaceRequest(updatedWorkspaceName, tc.workspace.id, tc.updateUser.token)
            .expect((res: GqlResponseModel) => {
                const previouslyCreatedWorkspace = tc.workspace;
                tc.workspace = res.body.data.updateWorkspace;

                expect(res.body.errors).toBeUndefined();

                expect(tc.workspace.name).not.toEqual(previouslyCreatedWorkspace.name);
                expect(tc.workspace.name).toEqual(updatedWorkspaceName);
                expect(tc.workspace.id).toEqual(previouslyCreatedWorkspace.id);
                expect(tc.workspace.ownerId).toEqual(previouslyCreatedWorkspace.ownerId);
                expect(tc.workspace.ownerName).toEqual(previouslyCreatedWorkspace.ownerName);
                expect(tc.workspace.created).toEqual(previouslyCreatedWorkspace.created);
                expect(tc.workspace.updated).not.toEqual(previouslyCreatedWorkspace.updated);
            });
    });

    it(`user with NO roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.noRolesUser.token);
    });

    it(`user with CAN_VIEW roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.viewUser.token);
    });

    it(`user with CAN_UPDATE roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.updateUser.token);
    });

    it(`user with CAN_ADD_CONTENT roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.addContentUser.token);
    });

    it(`user with CAN_UPDATED_CONTENT roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.updateContentUser.token);
    });

    it(`user with CAN_REMOVE_CONTENT roles can't remove workspace`, () => {
        return removeWorkspaceTest(tc.removeContentUser.token);
    });

    it(`user with CAN_REMOVE roles can remove workspace`, () => {
        return workspaceTestHelper
            .removeWorkspaceRequest(tc.workspace.id, tc.removeUser.token)
            .expect((res: GqlResponseModel) => {
                expect(res.body.errors).toBeUndefined();
                expect(res.body.data.removeWorkspace).toBe(tc.workspace.id);
            });
    });
});
