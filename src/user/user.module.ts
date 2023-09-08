import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './service/user.service';
import { UserEntity } from './entity/user.entity';

import { AuthResolver } from './resolver/auth.resolver';
import { UserResolver } from './resolver/user.resolver';
import { WorkspaceService } from 'src/workspace/service/workspace.service';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import { CustomWorkspaceAccessRepository } from 'src/workspace/repository/custom-workspace-access.repository';
import { WorkspaceAccessEntity } from 'src/workspace/entity/workspace-access.view.entity';
import { WordGroupEntity } from 'src/word/entity/word-group.entity';
import { CustomWordGroupRepository } from 'src/word/repository/custom-word-group.repository';
import { WordGroupService } from 'src/word/service/word-group.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        UserEntity,
        WorkspaceEntity,
        WorkspaceAccessEntity,
        WordGroupEntity
      ])
    ],
    providers: [
      UserService,
      AuthResolver,
      UserResolver,
      WorkspaceService,
      CustomWorkspaceAccessRepository,
      CustomWordGroupRepository,
      WordGroupService
    ],
})
export class UserModule {}
