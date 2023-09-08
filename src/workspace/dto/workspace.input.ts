import { IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class WorkspaceInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    readonly name: string;
}
