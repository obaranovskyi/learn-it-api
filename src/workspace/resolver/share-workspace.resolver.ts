import { Resolver, Mutation, Context, Args, Query, Int } from '@nestjs/graphql';
import { UsePipes, Logger, UseGuards } from '@nestjs/common';

import { ShareWorkspaceService } from '../service/share-workspace.service';
import { ValidationPipe } from '../../shared/pipe/validation.pipe';
import { AuthGuard } from '../../shared/guard/auth.guard';
import { ShareWorkspaceInput } from '../dto/share-workspace.input';
import { ShareWorkspaceResponseModel } from '../model/share-workspace-response.model';
import { JwtUserModel } from '../../user/model/jwt-user.model';
import { AppLogger } from '../../shared/logger/app.logger';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';

@Resolver()
@UseGuards(AuthGuard)
export class ShareWorkspaceResolver {
    private logger: Logger = new AppLogger(ShareWorkspaceResolver.name);

    constructor(private readonly shareWorkspaceService: ShareWorkspaceService) {}

    @Mutation(() => ShareWorkspaceResponseModel)
    @UsePipes(new ValidationPipe())
    async createShareWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('shareWorkspaceInput') shareWorkspaceInput: ShareWorkspaceInput
    ): Promise<ShareWorkspaceResponseModel> {
        this.logger.log({ action: this.createShareWorkspace.name, user, data: { shareWorkspaceInput } });

        return this.shareWorkspaceService.create(user.id, shareWorkspaceInput);
    }

    @Query(() => [ShareWorkspaceResponseModel])
    findAllShareWorkspaces(@Context('user') user: JwtUserModel): Promise<ShareWorkspaceResponseModel[]> {
        this.logger.log({ action: this.findAllShareWorkspaces.name, user });

        return this.shareWorkspaceService.findAll(user.id);
    }

    @Query(() => ShareWorkspaceResponseModel)
    findShareWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('shareWorkspaceId', { type: () => Int }) id: number
    ): Promise<ShareWorkspaceResponseModel> {
        this.logger.log({ action: this.findShareWorkspace.name, user, data: { id } });

        return this.shareWorkspaceService.findOne(user.id, id);
    }

    @Mutation(() => ShareWorkspaceResponseModel)
    updateShareWorkspaceRoles(
        @Context('user') user: JwtUserModel,
        @Args('shareWorkspaceId', { type: () => Int }) shareWorkspaceId: number,
        @Args('roles', { type: () => [ShareWorkspaceRolesEnum] }) roles: ShareWorkspaceRolesEnum[]
    ): Promise<ShareWorkspaceResponseModel> {
        console.log(roles);
        this.logger.log({ action: this.updateShareWorkspaceRoles.name, user, data: { shareWorkspaceId, roles } });

        return this.shareWorkspaceService.updateRoles(user.id, roles, shareWorkspaceId);
    }

    @Mutation(() => Int)
    async removeShareWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('shareWorkspaceId', { type: () => Int }) id: number
    ): Promise<number> {
        this.logger.log({ action: this.removeShareWorkspace.name, user, data: { id } });
        await this.shareWorkspaceService.remove(user.id, id);

        return id;
    }
}
