import { WorkspaceResponseModel } from '../../src/workspace/model/workspace-response.model';
import { UserResponseModel } from '../../src/user/model/user-response.model';

export interface WorkspaceAccessFactoryModel {
    owner: UserResponseModel;
    workspace: WorkspaceResponseModel;

    viewUser: UserResponseModel;
    updateUser: UserResponseModel;
    removeUser: UserResponseModel;
    noRolesUser: UserResponseModel;
    addContentUser: UserResponseModel;
    removeContentUser: UserResponseModel;
    updateContentUser: UserResponseModel;
}
