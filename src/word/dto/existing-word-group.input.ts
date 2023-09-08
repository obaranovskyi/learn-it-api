import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ExistingWordGroupInput {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    wordGroupId: number;

    @IsNumber()
    @IsPositive()
    @Field(() => Int)
    workspaceId: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    groupName: string;
}
