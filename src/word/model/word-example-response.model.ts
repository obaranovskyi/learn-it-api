import { ObjectType, Field, Int } from '@nestjs/graphql';

import { BaseResponseModel } from '../../shared/models/base-response.model';

@ObjectType()
export class WordExampleResponseModel extends BaseResponseModel {
   @Field() 
   value: string;

   @Field()
   header?: string;

   @Field()
   translation?: string;

   @Field()
   description?: string;

   @Field(() => Int!)
   wordId: number;
}
