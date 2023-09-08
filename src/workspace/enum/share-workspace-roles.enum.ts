import { registerEnumType } from '@nestjs/graphql';

export enum ShareWorkspaceRolesEnum {
    CAN_VIEW = 'CAN_VIEW',
    CAN_UPDATE = 'CAN_UPDATE',
    CAN_REMOVE = 'CAN_REMOVE',
    CAN_ADD_CONTENT = 'CAN_ADD_CONTENT',
    CAN_UPDATE_CONTENT = 'CAN_UPDATE_CONTENT',
    CAN_REMOVE_CONTENT = 'CAN_REMOVE_CONTENT',
}

registerEnumType(ShareWorkspaceRolesEnum, { name: 'ShareWorkspaceRolesEnum' });

export function getAllShareWorkspaceRoles(): ShareWorkspaceRolesEnum[] {
    return [
        ShareWorkspaceRolesEnum.CAN_VIEW,
        ShareWorkspaceRolesEnum.CAN_UPDATE,
        ShareWorkspaceRolesEnum.CAN_REMOVE,
        ShareWorkspaceRolesEnum.CAN_ADD_CONTENT,
        ShareWorkspaceRolesEnum.CAN_UPDATE_CONTENT,
        ShareWorkspaceRolesEnum.CAN_REMOVE_CONTENT,
    ];
}
