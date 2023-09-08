import { ObjectType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class BaseResponseModel {
    @Field(() => Int)
    id: number;

    @Field(() => GraphQLISODateTime)
    created: Date;

    @Field(() => GraphQLISODateTime)
    updated?: Date;
}
