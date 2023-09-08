import { WorkspaceAccessFactory } from '../workspace/workspace-access.factory';

import { WordGroupAccessFactoryModel } from '../../models/word-group-access-factory.model';
import { WordGroupResponseModel } from '../../../src/word/model/word-group-response.model';
import { WordGroupTestHelper } from './word-group.helper';

export class WordGroupAccessFactory extends WorkspaceAccessFactory {
    wordGroupTestHelper: WordGroupTestHelper;

    wordGroup: WordGroupResponseModel;

    constructor() {
        super();

        this.wordGroupTestHelper = new WordGroupTestHelper();
    }

    toTestContent(): WordGroupAccessFactoryModel {
        return {
            ...super.toTestContent(),
            wordGroup: this.wordGroup,
        };
    }

    async init(): Promise<void> {
        await super.init();
        await this.createWordGroup();
    }

    async createWordGroup(): Promise<void> {
        this.wordGroup = await this.wordGroupTestHelper.createWordGroup(this.workspace.id, this.owner.token);
    }
}
