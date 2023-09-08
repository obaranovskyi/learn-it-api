import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

@InputType()
export class WordStatsInput {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    durationInSeconds: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    wordId: number;
}
