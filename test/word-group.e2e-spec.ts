import request from 'supertest';

import { WordGroupResolver } from '../src/word/resolver/word-group.resolver';
import { UserTestHelper } from './helper/user/user.helper';
import { WordGroupResponseModel } from '../src/word/model/word-group-response.model';
import { WordGroupTestHelper } from './helper/word/word-group.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { cannotBeDone } from './helper/common-gql.helper';
import { WorkspaceAccessFactory } from './helper/workspace/workspace-access.factory';
import { WorkspaceAccessFactoryModel } from './models/workspace-access-factory.model';

describe(`${WordGroupResolver.name} (e2e)`, () => {
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const testHelper: WordGroupTestHelper = new WordGroupTestHelper();
    const workspaceAccessFactory: WorkspaceAccessFactory = new WorkspaceAccessFactory();
    let tc: WorkspaceAccessFactoryModel;

    let wordGroup: WordGroupResponseModel;
    let ownerWordGroup: WordGroupResponseModel;

    const negativeTestCreateWithRole = (token: string): request.Test => {
        return testHelper.createWordGroupRequest(tc.workspace.id, token).expect(cannotBeDone);
    };

    const negativeTestFindAllWithRole = (token: string): request.Test => {
        return testHelper.findWordGroupsRequest(tc.workspace.id, token).expect(cannotBeDone);
    };

    const negativeTestFindWithRole = (token: string): request.Test => {
        return testHelper.findWordGroupRequest(wordGroup.id, token).expect(cannotBeDone);
    };

    const negativeTestUpdateWithRole = (token: string): request.Test => {
        const newWordGroupName = `Updated word group name - ${Date.now()}`;

        return testHelper
            .updateWordGroupRequest(wordGroup.id, tc.workspace.id, newWordGroupName, token)
            .expect(cannotBeDone);
    };

    const negativeTestRemoveWithRole = (token: string): request.Test => {
        return testHelper.removeWordGroupRequest(wordGroup.id, tc.workspace.id, token).expect(cannotBeDone);
    };

    const positiveTestCreateWithRole = (token: string): request.Test => {
        return testHelper.createWordGroupRequest(tc.workspace.id, token).expect((res: GqlResponseModel) => {
            const isOwnerCreator = token === tc.owner.token;

            if (isOwnerCreator) ownerWordGroup = res.body.data.createWordGroup;

            if (!isOwnerCreator) wordGroup = res.body.data.createWordGroup;

            const group: WordGroupResponseModel = wordGroup || ownerWordGroup;

            expect(res.body.errors).toBeUndefined();
            expect(group.id).toBeDefined();
            expect(group.name).toBeDefined();
            expect(group.workspaceId).toBe(tc.workspace.id);
            expect(group.workspaceOwnerId).toBe(tc.owner.id);
            expect(group.workspaceOwnerName).toBe(tc.owner.username);
            expect(group.created).toBeDefined();
            expect(group.updated).toBeDefined();
        });
    };

    const positiveTestFindAllWithRole = (token: string): request.Test => {
        return testHelper.findWordGroupsRequest(tc.workspace.id, token).expect((res: GqlResponseModel) => {
            const isOwnerToken = token === tc.owner.token;

            expect(res.body.data.findWordGroups).toContainEqual(wordGroup);

            if (isOwnerToken) {
                expect(res.body.data.findWordGroups).toContainEqual(ownerWordGroup);
            }

            expect(res.body.data.findWordGroups).toContainEqual(wordGroup);

            expect(res.body.errors).toBeUndefined();
        });
    };

    const positiveTestFindWithRole = (token: string): request.Test => {
        return testHelper.findWordGroupRequest(wordGroup.id, token).expect((res: GqlResponseModel) => {
            const receivedWordGroup = res.body.data.findWordGroup;

            expect(res.body.errors).toBeUndefined();
            expect(receivedWordGroup).toEqual(wordGroup);
        });
    };

    const positiveTestUpdateWithRole = (token: string): request.Test => {
        const newWordGroupName = `Updated word group name - ${Date.now()}`;

        return testHelper
            .updateWordGroupRequest(wordGroup.id, tc.workspace.id, newWordGroupName, token)
            .expect((res: GqlResponseModel) => {
                const previousWordGroup = wordGroup;
                wordGroup = res.body.data.updateWordGroup;

                expect(res.body.errors).toBeUndefined();

                expect(wordGroup.id).toBe(previousWordGroup.id);
                expect(wordGroup.name).toBe(newWordGroupName);
                expect(wordGroup.workspaceId).toBe(previousWordGroup.workspaceId);
                expect(wordGroup.workspaceOwnerId).toBe(previousWordGroup.workspaceOwnerId);
                expect(wordGroup.workspaceOwnerName).toBe(previousWordGroup.workspaceOwnerName);
                expect(wordGroup.created).toBeDefined();
                expect(wordGroup.updated).toBeDefined();
            });
    };

    const positiveTestRemoveWithRole = (wordGroupId: number, token: string): request.Test => {
        return testHelper.removeWordGroupRequest(wordGroupId, tc.workspace.id, token).expect((res: GqlResponseModel) => {
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data.removeWordGroup).toBe(wordGroupId);
        });
    };

    beforeAll(async () => {
        await workspaceAccessFactory.init();

        tc = workspaceAccessFactory.toTestContent();
    });

    afterAll(async () => {
        await userTestHelper.removeAllUsers(workspaceAccessFactory.toUsers());
    });

    // ---------- Add Word Group Section ----------
    it('user with CAN_VIEW share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role cannot add the word group', () => {
        return negativeTestCreateWithRole(tc.updateContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can add the word group', () => {
        return positiveTestCreateWithRole(tc.addContentUser.token);
    });

    it('workspace owner can add the word group', () => {
        return positiveTestCreateWithRole(tc.owner.token);
    });

    // ---------- View One Word Group Section ----------
    it('user with CAN_VIEW share role can view the word group', () => {
        return positiveTestFindWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role can view the word group', () => {
        return positiveTestFindWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role can view the word group', () => {
        return positiveTestFindWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot view the word group', () => {
        return negativeTestFindWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can view the word group', () => {
        return positiveTestFindWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can view the word group', () => {
        return positiveTestFindWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can view word group', () => {
        return positiveTestFindWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can view the word group', () => {
        return positiveTestFindWithRole(tc.owner.token);
    });

    // ---------- View All Word Groups Section ----------
    it('user with CAN_VIEW share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot view the word group in the list', () => {
        return negativeTestFindAllWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can view word group in the list', () => {
        return positiveTestFindAllWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can view the word group', () => {
        return positiveTestFindAllWithRole(tc.owner.token);
    });

    // ---------- Update Word Group Section ----------
    it('user with CAN_VIEW share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role cannot update the word group', () => {
        return negativeTestUpdateWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can update word group name', () => {
        return positiveTestUpdateWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can update the word group', () => {
        return positiveTestUpdateWithRole(tc.owner.token);
    });

    // ---------- Remove Word Group Section ----------
    it('user with CAN_VIEW share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_ADD_CONTENT share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role cannot remove the word group', () => {
        return negativeTestRemoveWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can update the word group', () => {
        return positiveTestRemoveWithRole(ownerWordGroup.id, tc.owner.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can remove the word group', () => {
        return positiveTestRemoveWithRole(wordGroup.id, tc.removeContentUser.token);
    });
});
