import { Mutation, Context, Args, Resolver, Int, Query } from '@nestjs/graphql';
import { UsePipes, UseGuards, Logger } from '@nestjs/common';

import { AuthGuard } from '../../shared/guard/auth.guard';
import { AppLogger } from '../../shared/logger/app.logger';
import { WordService } from '../service/word.service';
import { ValidationPipe } from '../../shared/pipe/validation.pipe';
import { JwtUserModel } from '../../user/model/jwt-user.model';
import { WordResponseModel } from '../model/word-response.model';
import { WordInput } from '../dto/word.input';
import { ExistingWordInput } from '../dto/existing-word.input';

@Resolver()
@UseGuards(AuthGuard)
export class WordResolver {
    private logger: Logger = new AppLogger(WordResolver.name);

    constructor(private readonly wordService: WordService) {}

    @Query(() => WordResponseModel)
    findWord(
        @Context('user') user: JwtUserModel,
        @Args('wordId', { type: () => Int }) wordId: number
    ): Promise<WordResponseModel> {
        this.logger.log({ action: this.findWord.name, user, data: { wordId } });

        return this.wordService.findOne(wordId, user.id);
    }

    @Query(() => [WordResponseModel])
    findWords(
        @Context('user') user: JwtUserModel,
        @Args('wordGroupId', { type: () => Int }) wordGroupId: number
    ): Promise<WordResponseModel[]> {
        this.logger.log({ action: this.findWords.name, user });

        return this.wordService.findAll(wordGroupId, user.id);
    }

    @Mutation(() => WordResponseModel)
    @UsePipes(new ValidationPipe())
    createWord(
        @Context('user') user: JwtUserModel,
        @Args('wordInput') wordInput: WordInput
    ): Promise<WordResponseModel> {
        this.logger.log({ action: this.createWord.name, user, data: { wordInput } });

        return this.wordService.create(wordInput, user.id);
    }

    @Mutation(() => WordResponseModel)
    @UsePipes(new ValidationPipe())
    updateWord(
        @Context('user') user: JwtUserModel,
        @Args('wordInput') wordInput: ExistingWordInput
    ): Promise<WordResponseModel> {
        this.logger.log({ action: this.updateWord.name, user, data: { wordInput } });

        return this.wordService.update(wordInput, user.id);
    }

    @Mutation(() => Int)
    @UsePipes(new ValidationPipe())
    async removeWord(
        @Context('user') user: JwtUserModel,
        @Args('wordId', { type: () => Int }) wordId: number
    ): Promise<number> {
        this.logger.log({ action: this.removeWord.name, user, data: { wordId } });

        await this.wordService.remove(wordId, user.id);

        return wordId;
    }
}
