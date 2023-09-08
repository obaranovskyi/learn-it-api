import { In, getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { pluck } from 'ramda';

import { WordTestInput } from '../dto/word-test.input';
import { WordStatsInput } from '../dto/word-stats.input';
import { WordEntity } from '../../word/entity/word.entity';
import { WordStatsEntity } from '../entity/word-stats.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class WordStatsService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(WordEntity) private readonly wordRepository: Repository<WordEntity> 
    ) {}

    async create(wordTestInput: WordTestInput, userId: number): Promise<void> {
        const wordIds = pluck('wordId', wordTestInput.wordStats);

        const user = await this.userRepository.findOne({ where: { id: userId }});
        const words = await this.wordRepository.find({
            relations: ['wordGroup'],
            where: { id: In(wordIds) },
        });

        const wordStats = wordTestInput.wordStats.map((wordStat: WordStatsInput) => {
            const currWord = words.find((word: WordEntity) => {
                return wordStat.wordId === word.id;
            });

            return {
                word: currWord,
                wordGroup: currWord.wordGroup,
                workspace: currWord.wordGroup.workspace,
                user,
                durationInSeconds: wordStat.durationInSeconds,
            };
        });

        await getConnection().createQueryBuilder().insert().into(WordStatsEntity).values(wordStats).execute();
    }
}
