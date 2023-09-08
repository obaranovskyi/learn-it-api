import { WordGroupResponseModel } from '../../src/word/model/word-group-response.model';
import { UserResponseModel } from '../../src/user/model/user-response.model';
import { WorkspaceResponseModel } from '../../src/workspace/model/workspace-response.model';
import { WordResponseModel } from 'src/word/model/word-response.model';

export interface StatsRelationSupplierModel {
    user: UserResponseModel;
    workspace: WorkspaceResponseModel;
    wordGroup: WordGroupResponseModel;
    words: WordResponseModel[];
}
