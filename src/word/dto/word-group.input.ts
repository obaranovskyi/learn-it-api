import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class WordGroupInput {
    @IsNumber()
    @IsPositive()
    @Field(() => Int)
    workspaceId: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    groupName: string;
}
