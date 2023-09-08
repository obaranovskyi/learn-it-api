import { UsePipes, Logger, UseGuards } from '@nestjs/common';
import { Context, Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';

import { WorkspaceService } from '../service/workspace.service';
import { WorkspaceResponseModel } from '../model/workspace-response.model';
import { WorkspaceInput } from '../dto/workspace.input';
import { ValidationPipe } from '../../shared/pipe/validation.pipe';
import { AuthGuard } from '../../shared/guard/auth.guard';
import { JwtUserModel } from '../../user/model/jwt-user.model';
import { AppLogger } from '../../shared/logger/app.logger';

@Resolver()
@UseGuards(AuthGuard)
export class WorkspaceResolver {
    private logger: Logger = new AppLogger(WorkspaceResolver.name);

    constructor(private readonly workspaceService: WorkspaceService) {}

    @Query(() => [WorkspaceResponseModel])
    findAllWorkspaces(@Context('user') user: JwtUserModel): Promise<WorkspaceResponseModel[]> {
        this.logger.log({ action: this.findAllWorkspaces.name, user });

        return this.workspaceService.findAll(user.id);
    }

    @Query(() => WorkspaceResponseModel)
    findWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('workspaceId', { type: () => Int }) id: number
    ): Promise<WorkspaceResponseModel> {
        this.logger.log({ action: this.findWorkspace.name, user, data: { workspaceId: id } });

        return this.workspaceService.findOne(user.id, id);
    }

    @Mutation(() => WorkspaceResponseModel)
    @UsePipes(new ValidationPipe())
    createWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('workspaceInput') workspaceInput: WorkspaceInput
    ): Promise<WorkspaceResponseModel> {
        this.logger.log({ action: this.createWorkspace.name, user, data: { workspaceInput } });

        return this.workspaceService.create(user.id, workspaceInput);
    }

    @Mutation(() => WorkspaceResponseModel)
    @UsePipes(new ValidationPipe())
    async updateWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('id', { type: () => Int }) id: number,
        @Args('workspaceInput') workspaceInput: WorkspaceInput
    ): Promise<WorkspaceResponseModel> {
        this.logger.log({ action: this.updateWorkspace.name, user, data: { workspaceInput, id } });
        const updatedWorkspace = await this.workspaceService.update(user.id, id, workspaceInput);

        return updatedWorkspace.toResponseObject();
    }

    @Mutation(() => Int)
    async removeWorkspace(
        @Context('user') user: JwtUserModel,
        @Args('workspaceId', { type: () => Int }) workspaceId: number
    ): Promise<number> {
        this.logger.log({ action: this.removeWorkspace.name, user, data: { workspaceId } });
        await this.workspaceService.remove(user.id, workspaceId);

        return workspaceId;
    }
}
