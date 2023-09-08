import { ObjectType, Field, Int } from '@nestjs/graphql';

import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';
import { WorkspaceResponseModel } from './workspace-response.model';
import { BaseResponseModel } from '../../shared/models/base-response.model';

@ObjectType()
export class ShareWorkspaceResponseModel extends BaseResponseModel {
    @Field(() => [ShareWorkspaceRolesEnum])
    roles: ShareWorkspaceRolesEnum[];

    @Field(() => Int)
    userId: number;

    @Field()
    username: string;

    @Field(() => Int)
    ownerId: number;

    @Field()
    ownerName: string;

    @Field(() => WorkspaceResponseModel)
    workspace: WorkspaceResponseModel;
}
