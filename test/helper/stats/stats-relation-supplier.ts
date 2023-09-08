import * as R from 'ramda';

import { UserResponseModel } from '../../../src/user/model/user-response.model';
import { UserTestHelper } from '../user/user.helper';
import { WorkspaceTestHelper } from '../workspace/workspace.helper';
import { WorkspaceResponseModel } from '../../../src/workspace/model/workspace-response.model';
import { StatsRelationSupplierModel } from '../../models/stats-relation-supplier.model';
import { WordGroupResponseModel } from 'src/word/model/word-group-response.model';
import { WordGroupTestHelper } from '../word/word-group.helper';
import { WordTestHelper } from '../word/word.helper';
import { WordResponseModel } from 'src/word/model/word-response.model';

export class StatsRelationSupplier {
    userTestHelper: UserTestHelper;
    workspaceTestHelper: WorkspaceTestHelper;
    wordGroupTestHelper: WordGroupTestHelper;
    wordTestHelper: WordTestHelper;

    user: UserResponseModel;
    workspace: WorkspaceResponseModel;
    wordGroup: WordGroupResponseModel;
    words: WordResponseModel[];

    constructor(private readonly numberOfWords: number) {
        this.userTestHelper = new UserTestHelper();
        this.workspaceTestHelper = new WorkspaceTestHelper();
        this.wordGroupTestHelper = new WordGroupTestHelper();
        this.wordTestHelper = new WordTestHelper();
    }

    toTestContent(): StatsRelationSupplierModel {
        return {
            user: this.user,
            workspace: this.workspace,
            wordGroup: this.wordGroup,
            words: this.words,
        };
    }

    async init(): Promise<void> {
        await this.createUser();
        await this.createWorkspace();
        await this.createWordGroup();
        await this.createWords();
    }

    async createWorkspace(): Promise<void> {
        this.workspace = await this.workspaceTestHelper.createWorkspace(this.user.token);
    }

    async createUser(): Promise<void> {
        this.user = await this.userTestHelper.createUser();
    }

    async createWordGroup(): Promise<void> {
        this.wordGroup = await this.wordGroupTestHelper.createWordGroup(this.workspace.id, this.user.token);
    }

    async createWords(): Promise<void> {
        const createWordPromises = R.times((index: number) => {
            return this.wordTestHelper.createWord(
                {
                    wordGroupId: this.wordGroup.id,
                    value: `value ${index}`,
                    translation: `translation ${index}`,
                    description: `description ${index}`,
                    examples: [`example 1 from ${index}`, `example 2 from ${index}`, `example 3 from ${index}`],
                },
                this.user.token
            );
        }, this.numberOfWords);

        this.words = await Promise.all(createWordPromises);
    }
}
