import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WordResolver } from './resolver/word.resolver';
import { WordService } from './service/word.service';
import { WordGroupService } from './service/word-group.service';
import { WordGroupResolver } from './resolver/word-group.resolver';
import { CustomShareWorkspaceRepository } from '../workspace/repository/custom-share-workspace.repository';
import { CustomWorkspaceAccessRepository } from '../workspace/repository/custom-workspace-access.repository';
import { WorkspaceEntity } from '../workspace/entity/workspace.entity';
import { CustomWordGroupRepository } from './repository/custom-word-group.repository';
import { CustomWordRepository } from './repository/custom-word.repository';
import { WorkspaceAccessEntity } from '../workspace/entity/workspace-access.view.entity';
import { ShareWorkspaceEntity } from '../workspace/entity/share-workspace.entity';
import { WordGroupEntity } from './entity/word-group.entity';
import { WordEntity } from './entity/word.entity';
import { WordExampleEntity } from './entity/word-example.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkspaceEntity,
            WordGroupEntity,
            WordExampleEntity,
            WordEntity,
            WorkspaceAccessEntity,
            ShareWorkspaceEntity
        ]),
    ],
    providers: [
      WordGroupService,
      WordService,
      WordGroupResolver,
      WordResolver,
      CustomWorkspaceAccessRepository,
      CustomShareWorkspaceRepository,
      CustomWordGroupRepository,
      CustomWordRepository
    ],
})
export class WordModule {}
