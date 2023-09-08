import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WordEntity } from '../entity/word.entity';

@Injectable()
export class CustomWordRepository {

    constructor(
        @InjectRepository(WordEntity) private readonly wordRepository: Repository<WordEntity> 
    ) {}

    async isNameUniq(originalValue: string, wordGroupId: number): Promise<boolean> {
        const word = await this.wordRepository.findOne({
            where: { originalValue, wordGroup: { id: wordGroupId } },
        });

        return Boolean(word);
    }
}
