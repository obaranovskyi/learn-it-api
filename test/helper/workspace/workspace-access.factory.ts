import { UserResponseModel } from '../../../src/user/model/user-response.model';
import { UserTestHelper } from '../user/user.helper';
import { ShareWorkspaceTestHelper } from './share-workspace.helper';
import { ShareWorkspaceRolesEnum } from '../../../src/workspace/enum/share-workspace-roles.enum';
import { WorkspaceTestHelper } from './workspace.helper';
import { WorkspaceResponseModel } from '../../../src/workspace/model/workspace-response.model';
import { WorkspaceAccessFactoryModel } from '../../models/workspace-access-factory.model';

export class WorkspaceAccessFactory {
    userTestHelper: UserTestHelper;
    shareWorkspaceTestHelper: ShareWorkspaceTestHelper;
    workspaceTestHelper: WorkspaceTestHelper;

    owner: UserResponseModel;
    workspace: WorkspaceResponseModel;

    viewUser: UserResponseModel;
    updateUser: UserResponseModel;
    removeUser: UserResponseModel;
    noRolesUser: UserResponseModel;
    addContentUser: UserResponseModel;
    removeContentUser: UserResponseModel;
    updateContentUser: UserResponseModel;

    constructor() {
        this.userTestHelper = new UserTestHelper();
        this.shareWorkspaceTestHelper = new ShareWorkspaceTestHelper();
        this.workspaceTestHelper = new WorkspaceTestHelper();
    }

    toTestContent(): WorkspaceAccessFactoryModel {
        return {
            owner: this.owner,
            workspace: this.workspace,
            viewUser: this.viewUser,
            updateUser: this.updateUser,
            removeUser: this.removeUser,
            noRolesUser: this.noRolesUser,
            addContentUser: this.addContentUser,
            removeContentUser: this.removeContentUser,
            updateContentUser: this.updateContentUser,
        };
    }

    toUsers(): UserResponseModel[] {
        const tc = this.toTestContent();

        Reflect.deleteProperty(tc, 'workspace');
        Reflect.deleteProperty(tc, 'wordGroup');

        return Reflect.ownKeys(tc).map((userKey: string) => {
            return tc[userKey];
        });
    }

    async init(): Promise<void> {
        await this.createUsers();
        await this.createWorkspace();
        await this.createShareWorkspaces();
    }

    async createWorkspace(): Promise<void> {
        this.workspace = await this.workspaceTestHelper.createWorkspace(this.owner.token);
    }

    async createUsers(): Promise<void> {
        this.owner = await this.userTestHelper.createUser();
        this.viewUser = await this.userTestHelper.createUser();
        this.updateUser = await this.userTestHelper.createUser();
        this.removeUser = await this.userTestHelper.createUser();
        this.noRolesUser = await this.userTestHelper.createUser();
        this.addContentUser = await this.userTestHelper.createUser();
        this.removeContentUser = await this.userTestHelper.createUser();
        this.updateContentUser = await this.userTestHelper.createUser();
    }

    private async createShareWorkspaces(): Promise<void> {
        await this.shareWorkspaceTestHelper.createShareWorkspace(this.owner.token, this.viewUser.id, this.workspace.id, [
            ShareWorkspaceRolesEnum.CAN_VIEW,
        ]);
        await this.shareWorkspaceTestHelper.createShareWorkspace(this.owner.token, this.updateUser.id, this.workspace.id, [
            ShareWorkspaceRolesEnum.CAN_UPDATE,
        ]);
        await this.shareWorkspaceTestHelper.createShareWorkspace(this.owner.token, this.removeUser.id, this.workspace.id, [
            ShareWorkspaceRolesEnum.CAN_REMOVE,
        ]);
        await this.shareWorkspaceTestHelper.createShareWorkspace(this.owner.token, this.noRolesUser.id, this.workspace.id, []);
        await this.shareWorkspaceTestHelper.createShareWorkspace(this.owner.token, this.addContentUser.id, this.workspace.id, [
            ShareWorkspaceRolesEnum.CAN_ADD_CONTENT,
        ]);
        await this.shareWorkspaceTestHelper.createShareWorkspace(
            this.owner.token,
            this.removeContentUser.id,
            this.workspace.id,
            [ShareWorkspaceRolesEnum.CAN_REMOVE_CONTENT]
        );
        await this.shareWorkspaceTestHelper.createShareWorkspace(
            this.owner.token,
            this.updateContentUser.id,
            this.workspace.id,
            [ShareWorkspaceRolesEnum.CAN_UPDATE_CONTENT]
        );
    }
}
