import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WordStatsResolver } from './resolver/word-stats.resolver';
import { WordStatsService } from './service/word-stats.service';
import { WorkspaceEntity } from '../workspace/entity/workspace.entity';
import { CustomWordRepository } from '../word/repository/custom-word.repository';
import { UserEntity } from '../user/entity/user.entity';
import { WordGroupEntity } from '../word/entity/word-group.entity';
import { CustomWordGroupRepository } from '../word/repository/custom-word-group.repository';
import { WordEntity } from '../word/entity/word.entity';


@Module({
    imports: [
      TypeOrmModule.forFeature([
        WorkspaceEntity,
        UserEntity,
        WordGroupEntity,
        WordEntity
      ])
    ],
    providers: [
      WordStatsService,
      WordStatsResolver,
      CustomWordGroupRepository,
      CustomWordRepository
    ],
})
export class StatsModule {}
