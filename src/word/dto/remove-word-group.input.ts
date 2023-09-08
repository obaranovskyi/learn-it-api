import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class RemoveWordGroupInput {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    wordGroupId: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    workspaceId: number;
}
