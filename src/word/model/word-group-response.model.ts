import { ObjectType, Field, Int } from '@nestjs/graphql';

import { BaseResponseModel } from '../../shared/models/base-response.model';

@ObjectType()
export class WordGroupResponseModel extends BaseResponseModel {
    @Field(() => Int)
    workspaceId: number;

    @Field()
    workspaceOwnerName: string;

    @Field()
    name: string;

    @Field(() => Int)
    workspaceOwnerId: number;
}
