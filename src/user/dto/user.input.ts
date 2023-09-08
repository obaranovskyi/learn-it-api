import { IsNotEmpty } from 'class-validator';

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserInput {
    @IsNotEmpty()
    @Field()
    username: string;

    @IsNotEmpty()
    @Field()
    password: string;
}
