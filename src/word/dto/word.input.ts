import { IsString, IsNotEmpty, IsArray, IsOptional, IsInt, IsPositive } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class WordInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    value: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    translation: string;

    @IsString()
    @IsOptional() // TODO: has to be tested with the null
    @Field({ nullable: true })
    description?: string;

    @IsArray()
    @IsOptional()
    @Field(() => [String], { nullable: true })
    examples?: string[];

    @IsInt()
    @IsPositive()
    @Field(() => Int)
    wordGroupId: number;
}
