import { WorkspaceAccessFactoryModel } from './workspace-access-factory.model';
import { WordGroupResponseModel } from '../../src/word/model/word-group-response.model';

export interface WordGroupAccessFactoryModel extends WorkspaceAccessFactoryModel {
    wordGroup: WordGroupResponseModel;
}
