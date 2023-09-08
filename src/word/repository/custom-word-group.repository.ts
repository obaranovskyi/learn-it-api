import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WordGroupEntity } from '../entity/word-group.entity';

@Injectable()
export class CustomWordGroupRepository {

    constructor(
        @InjectRepository(WordGroupEntity) private readonly wordGroupRepository: Repository<WordGroupEntity>
    ) {}

    async isNameUniq(groupName: string, workspaceId: number): Promise<boolean> {
        const wordGroup = await this.wordGroupRepository.findOne({
            where: { name: groupName, workspace: { id: workspaceId } },
        });

        return Boolean(wordGroup);
    }
}
