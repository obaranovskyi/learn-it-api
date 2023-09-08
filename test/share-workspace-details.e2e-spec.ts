import { HttpStatus } from '@nestjs/common';

import { UserResponseModel } from '../src/user/model/user-response.model';
import { WorkspaceResponseModel } from '../src/workspace/model/workspace-response.model';
import { ShareWorkspaceInput } from '../src/workspace/dto/share-workspace.input';
import { getAllShareWorkspaceRoles, ShareWorkspaceRolesEnum } from '../src/workspace/enum/share-workspace-roles.enum';
import { ShareWorkspaceResponseModel } from '../src/workspace/model/share-workspace-response.model';
import { UserTestHelper } from './helper/user/user.helper';
import { WorkspaceTestHelper } from './helper/workspace/workspace.helper';
import { ShareWorkspaceTestHelper } from './helper/workspace/share-workspace.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { toException, cannotBeDone } from './helper/common-gql.helper';
import { Validation } from '../src/shared/constants/validation.constants';
import { ShareWorkspaceResolver } from '../src/workspace/resolver/share-workspace.resolver';
import { INVALID_ID } from './constants';

describe(`${ShareWorkspaceResolver.name} (e2e)`, () => {
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const workspaceTestHelper: WorkspaceTestHelper = new WorkspaceTestHelper();
    const testHelper: ShareWorkspaceTestHelper = new ShareWorkspaceTestHelper();
    let owner: UserResponseModel;
    let newCreatedUser: UserResponseModel;
    let createdWorkspace: WorkspaceResponseModel;
    let shareWorkspaceInput: ShareWorkspaceInput;
    let newSharedWorkspace: ShareWorkspaceResponseModel;
    let newViewOnlyRoleUser: UserResponseModel;
    let userNotAddedToShareWorkspace: UserResponseModel;
    let cascadeRemoveUser: UserResponseModel;

    beforeAll(async () => {
        owner = await userTestHelper.createUser(userTestHelper.getUniqUser('_1_'));
        newCreatedUser = await userTestHelper.createUser(userTestHelper.getUniqUser('_2_'));
        newViewOnlyRoleUser = await userTestHelper.createUser(userTestHelper.getUniqUser('_3_'));
        userNotAddedToShareWorkspace = await userTestHelper.createUser(userTestHelper.getUniqUser('_4_'));
        createdWorkspace = await workspaceTestHelper.createWorkspace(owner.token);

        shareWorkspaceInput = {
            roles: [ShareWorkspaceRolesEnum.CAN_VIEW],
            userId: newCreatedUser.id,
            workspaceId: createdWorkspace.id,
        };
    });

    afterAll(async () => {
        await workspaceTestHelper.removeWorkspace(createdWorkspace.id, owner.token);
        await userTestHelper.removeAllUsers([
            userNotAddedToShareWorkspace,
            newViewOnlyRoleUser,
            newCreatedUser,
            owner,
            cascadeRemoveUser,
        ]);
    });

    it('user can share workspace', () => {
        return testHelper.createShareWorkspaceRequest(shareWorkspaceInput, owner.token).expect((res: GqlResponseModel) => {
            newSharedWorkspace = res.body.data.createShareWorkspace;

            expect(res.body.errors).toBeUndefined();

            expect(newSharedWorkspace.userId).toEqual(newCreatedUser.id);
            expect(newSharedWorkspace.username).toEqual(newCreatedUser.username);
            expect(newSharedWorkspace.workspace.id).toEqual(createdWorkspace.id);
            expect(newSharedWorkspace.workspace.name).toEqual(createdWorkspace.name);
            expect(newSharedWorkspace.workspace.created).toBeDefined();
            expect(newSharedWorkspace.workspace.updated).toBeDefined();
            expect(newSharedWorkspace.ownerId).toEqual(owner.id);
            expect(newSharedWorkspace.ownerName).toEqual(owner.username);
            expect(newSharedWorkspace.roles).toEqual(shareWorkspaceInput.roles);
            expect(newSharedWorkspace.created).toBeDefined();
            expect(newSharedWorkspace.updated).toBeDefined();
        });
    });

    it('should return share workspace by id to owner', () => {
        return testHelper.findShareWorkspaceRequest(newSharedWorkspace.id, owner.token).expect((res: GqlResponseModel) => {
            const shareWorkspace = res.body.data.findShareWorkspace;

            expect(res.body.errors).toBeUndefined();
            expect(shareWorkspace).toMatchObject(newSharedWorkspace);
        });
    });

    it('should return share workspace by id to user which has any roles under the workspace', () => {
        return testHelper
            .findShareWorkspaceRequest(newSharedWorkspace.id, newCreatedUser.token)
            .expect((res: GqlResponseModel) => {
                const shareWorkspace = res.body.data.findShareWorkspace;

                expect(res.body.errors).toBeUndefined();
                expect(shareWorkspace).toMatchObject(newSharedWorkspace);
            });
    });

    it('should not return share workspace by id to user which has no rights and is not an owner', () => {
        return testHelper
            .findShareWorkspaceRequest(newSharedWorkspace.id, userNotAddedToShareWorkspace.token)
            .expect(cannotBeDone);
    });

    it('should return list workspaces shared with the user - for newly created user with one item', () => {
        return testHelper.findAllShareWorkspacesRequest(newCreatedUser.token).expect((res: GqlResponseModel) => {
            const firstShareWorkspace = res.body.data.findAllShareWorkspaces[0];

            expect(res.body.errors).toBeUndefined();

            expect(Array.isArray(res.body.data.findAllShareWorkspaces)).toBeTruthy();
            expect(firstShareWorkspace.userId).toEqual(newCreatedUser.id);
            expect(firstShareWorkspace.username).toEqual(newCreatedUser.username);
            expect(firstShareWorkspace.workspace.id).toEqual(createdWorkspace.id);
            expect(firstShareWorkspace.workspace.name).toEqual(createdWorkspace.name);
            expect(firstShareWorkspace.workspace.created).toBeDefined();
            expect(firstShareWorkspace.workspace.updated).toBeDefined();
            expect(firstShareWorkspace.ownerId).toEqual(owner.id);
            expect(firstShareWorkspace.ownerName).toEqual(owner.username);
            expect(firstShareWorkspace.roles).toEqual(shareWorkspaceInput.roles);
            expect(firstShareWorkspace.created).toBeDefined();
            expect(firstShareWorkspace.updated).toBeDefined();
        });
    });

    it('should return list workspaces shared with the user - for owner no items', () => {
        return testHelper.findAllShareWorkspacesRequest(owner.token).expect((res: GqlResponseModel) => {
            const shareWorkspaces = res.body.data.findAllShareWorkspaces;

            expect(res.body.errors).toBeUndefined();
            expect(Array.isArray(shareWorkspaces)).toBeTruthy();
            expect(shareWorkspaces.length).toBe(0);
        });
    });

    it('owner can update share workspace roles', () => {
        return testHelper
            .updateShareWorkspaceRolesRequest(newSharedWorkspace.id, getAllShareWorkspaceRoles(), owner.token)
            .expect((res: GqlResponseModel) => {
                newSharedWorkspace = res.body.data.updateShareWorkspaceRoles;

                expect(res.body.errors).toBeUndefined();
                expect(newSharedWorkspace.roles).toEqual(getAllShareWorkspaceRoles());
            });
    });

    it('not an owner cannot update share workspace roles', () => {
        return testHelper
            .updateShareWorkspaceRolesRequest(
                newSharedWorkspace.id,
                [ShareWorkspaceRolesEnum.CAN_VIEW],
                userNotAddedToShareWorkspace.token
            )
            .expect(cannotBeDone);
    });

    it('user with share role cannot update roles for himself', () => {
        return testHelper
            .updateShareWorkspaceRolesRequest(newSharedWorkspace.id, [ShareWorkspaceRolesEnum.CAN_VIEW], newCreatedUser.token)
            .expect(cannotBeDone);
    });

    it('share workspace cannot be removed if id is invalid', () => {
        return testHelper.removeShareWorkspaceRequest(INVALID_ID, owner.token).expect((res: GqlResponseModel) => {
            const { response, status } = toException(res);

            expect(res.body.data).toBeNull();
            expect(response).toBe(Validation.NOT_FOUND);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    it('share workspace cannot be removed if workspace is not shared with the user', () => {
        return testHelper
            .removeShareWorkspaceRequest(newSharedWorkspace.id, userNotAddedToShareWorkspace.token)
            .expect(cannotBeDone);
    });

    it('share workspace cannot be removed by added user without remove permissions', () => {
        return testHelper.removeShareWorkspaceRequest(newSharedWorkspace.id, newViewOnlyRoleUser.token).expect(cannotBeDone);
    });

    it('share workspace can be remove by added user with remove permissions', async () => {
        const newShareWorkspaceToRemove = await testHelper.createShareWorkspaceWithAllRoles(
            owner.token,
            newCreatedUser.id,
            createdWorkspace.id
        );

        return testHelper
            .removeShareWorkspaceRequest(newShareWorkspaceToRemove.id, newCreatedUser.token)
            .expect((res: GqlResponseModel) => {
                const removedShareWorkspaceId = res.body.data.removeShareWorkspace;

                expect(res.body.errors).toBeUndefined();
                expect(removedShareWorkspaceId).toBe(newShareWorkspaceToRemove.id);
            });
    });

    it('owner can remove the share workspace', () => {
        return testHelper.removeShareWorkspaceRequest(newSharedWorkspace.id, owner.token).expect((res: GqlResponseModel) => {
            const removedShareWorkspaceId = res.body.data.removeShareWorkspace;

            expect(res.body.errors).toBeUndefined();
            expect(removedShareWorkspaceId).toBe(newSharedWorkspace.id);
        });
    });

    it('when user removes the workspace it has to disappear from share workspaces', async () => {
        cascadeRemoveUser = await userTestHelper.createUser();
        const newCascadeWorkspace = await workspaceTestHelper.createWorkspace(owner.token);
        const newCascadeShareWorkspace = await testHelper.createShareWorkspaceWithAllRoles(
            owner.token,
            cascadeRemoveUser.id,
            newCascadeWorkspace.id
        );

        await workspaceTestHelper.removeWorkspace(newCascadeWorkspace.id, owner.token);

        return testHelper.findShareWorkspaceRequest(newCascadeShareWorkspace.id, owner.token).expect(cannotBeDone);
    });
});
