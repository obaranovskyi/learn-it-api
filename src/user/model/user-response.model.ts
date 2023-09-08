import { ObjectType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class UserResponseModel {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;

    @Field(() => GraphQLISODateTime)
    created: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    updated?: Date;

    @Field({ nullable: true })
    token?: string;
}
