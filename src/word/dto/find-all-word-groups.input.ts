import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindAllWordGroupsInput {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => Int)
    workspaceId: number;
}
