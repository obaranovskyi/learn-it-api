import { IsNotEmpty } from 'class-validator';

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UsernameUniquenessInput {
    @IsNotEmpty()
    @Field()
    username: string;
}
