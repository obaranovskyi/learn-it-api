import { ObjectType, Int, Field } from '@nestjs/graphql';

import { BaseResponseModel } from '../../shared/models/base-response.model';

@ObjectType()
export class WorkspaceResponseModel extends BaseResponseModel {
    @Field()
    name: string;

    @Field(() => Int, { nullable: true })
    ownerId: number;

    @Field({ nullable: true })
    ownerName: string;
}
