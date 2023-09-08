import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsArray } from 'class-validator';

import { WordStatsInput } from './word-stats.input';

@InputType()
export class WordTestInput {
    @IsNotEmpty()
    @IsArray()
    @Field(() => [WordStatsInput])
    wordStats: WordStatsInput[];
}
