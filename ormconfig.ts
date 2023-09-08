import { WorkspaceAccessEntity } from './src/workspace/entity/workspace-access.view.entity';
import { WorkspaceEntity } from './src/workspace/entity/workspace.entity';
import { ShareWorkspaceEntity } from './src/workspace/entity/share-workspace.entity';
import { UserEntity } from './src/user/entity/user.entity';
import { WordGroupEntity } from './src/word/entity/word-group.entity';
import { WordEntity } from './src/word/entity/word.entity';
import { WordExampleEntity } from 'src/word/entity/word-example.entity';


export const ORM_CONFIG: any = {
    type: "postgres",
    url: "postgres://postgres:admin@localhost/just_learn",
    logging: 'all',
    entities: [
      UserEntity,
      WordEntity,
      WordExampleEntity,
      WordGroupEntity,
      WorkspaceEntity,
      ShareWorkspaceEntity,
      WorkspaceAccessEntity
    ],
    synchronize: true,
    dropSchema: false,
    timezone: "Z"
}
