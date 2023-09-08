import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsArray, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';

@InputType()
export class ShareWorkspaceInput {
    @IsNotEmpty()
    @IsArray()
    @IsEnum(ShareWorkspaceRolesEnum, { each: true })
    @Field(() => [ShareWorkspaceRolesEnum])
    roles: ShareWorkspaceRolesEnum[];

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Field(() => Int)
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Field(() => Int)
    workspaceId: number;
}
