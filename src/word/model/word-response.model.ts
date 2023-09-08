import { ObjectType, Field, Int } from '@nestjs/graphql';

import { BaseResponseModel } from '../../shared/models/base-response.model';
import { WordExampleResponseModel } from './word-example-response.model';

@ObjectType()
export class WordResponseModel extends BaseResponseModel {
    @Field()
    value: string;

    @Field()
    translation: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int!)
    wordGroupId: number

    @Field(() => [WordExampleResponseModel], { nullable: true })
    examples?: WordExampleResponseModel[];
}
