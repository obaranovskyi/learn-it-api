import { Mutation, Context, Args, Resolver } from '@nestjs/graphql';
import { UsePipes, UseGuards, Logger } from '@nestjs/common';

import { AuthGuard } from '../../shared/guard/auth.guard';
import { AppLogger } from '../../shared/logger/app.logger';
import { WordStatsService } from '../service/word-stats.service';
import { ValidationPipe } from '../../shared/pipe/validation.pipe';
import { JwtUserModel } from '../../user/model/jwt-user.model';
import { WordTestInput } from '../dto/word-test.input';

@Resolver()
@UseGuards(AuthGuard)
export class WordStatsResolver {
    private logger: Logger = new AppLogger(WordStatsResolver.name);

    constructor(private readonly wordStatsService: WordStatsService) {}

    @Mutation(() => Boolean!, { nullable: true })
    @UsePipes(new ValidationPipe())
    async createWordTest(
        @Context('user') user: JwtUserModel,
        @Args('wordTestInput') wordTestInput: WordTestInput
    ): Promise<void> {
        this.logger.log({ action: this.createWordTest.name, user, data: { wordTestInput } });

        await this.wordStatsService.create(wordTestInput, user.id);
    }
}
