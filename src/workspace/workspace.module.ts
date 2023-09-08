import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from './entity/workspace.entity';
import { WorkspaceService } from './service/workspace.service';
import { ShareWorkspaceService } from './service/share-workspace.service';
import { UserEntity } from '../user/entity/user.entity';
import { CustomShareWorkspaceRepository } from './repository/custom-share-workspace.repository';
import { WorkspaceResolver } from './resolver/workspace.resolver';
import { ShareWorkspaceResolver } from './resolver/share-workspace.resolver';
import { CustomWorkspaceAccessRepository } from './repository/custom-workspace-access.repository';
import { WorkspaceAccessEntity } from './entity/workspace-access.view.entity';
import { ShareWorkspaceEntity } from './entity/share-workspace.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        WorkspaceEntity,
        UserEntity,
        WorkspaceAccessEntity,
        ShareWorkspaceEntity
      ])
    ],
    providers: [
      WorkspaceService,
      ShareWorkspaceService,
      ShareWorkspaceService,
      WorkspaceResolver,
      ShareWorkspaceResolver,
      CustomWorkspaceAccessRepository,
      CustomShareWorkspaceRepository
  ],
})
export class WorkspaceModule {}
