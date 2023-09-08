import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import { Resolver, Mutation, Context, Args, Int, Query } from '@nestjs/graphql';

import { AuthGuard } from '../../shared/guard/auth.guard';
import { AppLogger } from '../../shared/logger/app.logger';
import { WordGroupService } from '../service/word-group.service';
import { ValidationPipe } from '../../shared/pipe/validation.pipe';
import { JwtUserModel } from '../../user/model/jwt-user.model';
import { WordGroupResponseModel } from '../model/word-group-response.model';
import { WordGroupInput } from '../dto/word-group.input';
import { ExistingWordGroupInput } from '../dto/existing-word-group.input';
import { RemoveWordGroupInput } from '../dto/remove-word-group.input';
import { FindAllWordGroupsInput } from '../dto/find-all-word-groups.input';

@Resolver()
@UseGuards(AuthGuard)
export class WordGroupResolver {
    private logger: Logger = new AppLogger(WordGroupResolver.name);

    constructor(private readonly wordGroupService: WordGroupService) {}

    @Query(() => WordGroupResponseModel)
    findWordGroup(
        @Context('user') user: JwtUserModel,
        @Args('wordGroupId', { type: () => Int }) wordGroupId: number
    ): Promise<WordGroupResponseModel> {
        this.logger.log({ action: this.findWordGroup.name, user, data: { wordGroupId } });

        return this.wordGroupService.findOne(wordGroupId, user.id);
    }

    @Query(() => [WordGroupResponseModel])
    findAllWordGroups(
        @Context('user') user: JwtUserModel,
        @Args('findAllWordGroupsInput') findAllWordGroupsInput: FindAllWordGroupsInput
    ): Promise<WordGroupResponseModel[]> {
        this.logger.log({ action: this.findAllWordGroups.name, user });

        return this.wordGroupService.findAll(findAllWordGroupsInput.workspaceId, user.id);
    }

    @Mutation(() => WordGroupResponseModel)
    @UsePipes(new ValidationPipe())
    createWordGroup(
        @Context('user') user: JwtUserModel,
        @Args('wordGroupInput') wordGroupInput: WordGroupInput
    ): Promise<WordGroupResponseModel> {
        this.logger.log({ action: this.createWordGroup.name, user, data: { wordGroupInput } });

        return this.wordGroupService.create(wordGroupInput, user.id);
    }

    @Mutation(() => WordGroupResponseModel)
    @UsePipes(new ValidationPipe())
    updateWordGroup(
        @Context('user') user: JwtUserModel,
        @Args('wordGroupInput') wordGroupInput: ExistingWordGroupInput
    ): Promise<WordGroupResponseModel> {
        this.logger.log({ action: this.updateWordGroup.name, user, data: { wordGroupInput } });

        return this.wordGroupService.update(wordGroupInput, user.id);
    }

    @Mutation(() => Int)
    @UsePipes(new ValidationPipe())
    async removeWordGroup(
        @Context('user') user: JwtUserModel,
        @Args('removeWordGroupInput') removeWordGroupInput: RemoveWordGroupInput
    ): Promise<number> {
        this.logger.log({ action: this.removeWordGroup.name, user, data: { removeWordGroupInput } });

        await this.wordGroupService.remove(removeWordGroupInput, user.id);

        return removeWordGroupInput.wordGroupId;
    }
}
