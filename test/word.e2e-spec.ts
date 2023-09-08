import request from 'supertest';

import { WordResolver } from '../src/word/resolver/word.resolver';
import { UserTestHelper } from './helper/user/user.helper';
import { WordGroupAccessFactory } from './helper/word/word-group-access.factory';
import { WordGroupAccessFactoryModel } from './models/word-group-access-factory.model';
import { WordTestHelper } from './helper/word/word.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { WordInput } from '../src/word/dto/word.input';
import { WordResponseModel } from '../src/word/model/word-response.model';
import { cannotBeDone } from './helper/common-gql.helper';

describe(`${WordResolver.name} (e2e)`, () => {
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const wordGroupAccessFactory: WordGroupAccessFactory = new WordGroupAccessFactory();
    const testHelper: WordTestHelper = new WordTestHelper();
    let tc: WordGroupAccessFactoryModel;

    let wordInput: WordInput;
    let ownerWordInput: WordInput;

    let word: WordResponseModel;
    let ownerWord: WordResponseModel;

    const negativeTestCreateWithRole = (token: string): request.Test => {
        return testHelper.createWordRequest(wordInput, token).expect(cannotBeDone);
    };

    const negativeTestRemoveWithRole = (token: string): request.Test => {
        const isOwnerCreator = token === tc.owner.token;
        const wordToRemoveId = isOwnerCreator ? ownerWord.id : word.id;

        return testHelper.removeWordRequest(wordToRemoveId, token).expect(cannotBeDone);
    };

    const negativeTestFindWithRole = (token: string): request.Test => {
        return testHelper.findWordRequest(word.id, token).expect(cannotBeDone);
    };

    const negativeTestFindAllWithRole = (token: string): request.Test => {
        return testHelper.findWordsRequest(tc.wordGroup.id, token).expect(cannotBeDone);
    };

    const positiveTestCreateWithRole = (token: string): request.Test => {
        const isOwnerCreator = token === tc.owner.token;
        const expectedWordInput = isOwnerCreator ? ownerWordInput : wordInput;

        return testHelper.createWordRequest(expectedWordInput, token).expect((res: GqlResponseModel) => {
            if (isOwnerCreator) {
                ownerWord = res.body.data.createWord;
            }

            if (!isOwnerCreator) {
                word = res.body.data.createWord;
            }

            const actualWord: WordResponseModel = res.body.data.createWord;

            expect(res.body.errors).toBeUndefined();
            expect(actualWord.id).toBeDefined();
            expect(actualWord.created).toBeDefined();
            expect(actualWord.updated).toBeDefined();

            expect(actualWord.value).toBe(expectedWordInput.value);
            expect(actualWord.translation).toBe(expectedWordInput.translation);
            expect(actualWord.description).toBe(expectedWordInput.description);
            expect(actualWord.examples).toEqual(expect.arrayContaining(expectedWordInput.examples));
        });
    };

    const updateWordInput = (wordInputToUpdate: WordInput): void => {
        wordInputToUpdate.translation = `${wordInput.translation} updated ${Date.now()}`;
        wordInputToUpdate.description = `${wordInput.description} updated ${Date.now()}`;
        wordInputToUpdate.value = `${wordInput.value} updated ${Date.now()}`;
        wordInputToUpdate.examples = wordInput.examples.map((example: string) => {
            return `${example} updated ${Date.now()}`;
        });
    };

    const positiveTestUpdateWithRole = (token: string): request.Test => {
        const isOwnerCreator = token === tc.owner.token;
        const expectedWordInput = isOwnerCreator ? ownerWordInput : wordInput;
        const expectedWordId = isOwnerCreator ? ownerWord.id : word.id;

        updateWordInput(expectedWordInput);

        return testHelper
            .updateWordRequest({ ...expectedWordInput, wordId: expectedWordId }, token)
            .expect((res: GqlResponseModel) => {
                if (isOwnerCreator) {
                    ownerWord = res.body.data.updateWord;
                }

                if (!isOwnerCreator) {
                    word = res.body.data.updateWord;
                }

                const actualWord: WordResponseModel = res.body.data.updateWord;

                expect(res.body.errors).toBeUndefined();
                expect(actualWord.id).toBe(expectedWordId);
                expect(actualWord.created).toBeDefined();
                expect(actualWord.updated).toBeDefined();

                expect(actualWord.value).toBe(expectedWordInput.value);
                expect(actualWord.translation).toBe(expectedWordInput.translation);
                expect(actualWord.description).toBe(expectedWordInput.description);
                expect(actualWord.examples).toEqual(expect.arrayContaining(expectedWordInput.examples));
            });
    };

    const negativeTestUpdateWithRole = (token: string): request.Test => {
        updateWordInput(wordInput);

        return testHelper.updateWordRequest({ ...wordInput, wordId: word.id }, token).expect(cannotBeDone);
    };

    const positiveTestRemoveWithRole = (wordId: number, token: string): request.Test => {
        return testHelper.removeWordRequest(wordId, token).expect((res: GqlResponseModel) => {
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data.removeWord).toBe(wordId);
        });
    };

    const positiveTestFindWithRole = (token: string): request.Test => {
        return testHelper.findWordRequest(word.id, token).expect((res: GqlResponseModel) => {
            const receivedWordGroup = res.body.data.findWord;

            expect(res.body.errors).toBeUndefined();
            expect(receivedWordGroup).toEqual(word);
        });
    };

    const positiveTestFindAllWithRole = (token: string): request.Test => {
        return testHelper.findWordsRequest(tc.wordGroup.id, token).expect((res: GqlResponseModel) => {
            const isOwnerToken = token === tc.owner.token;
            const foundWords = res.body.data.findWords;

            expect(foundWords).toContainEqual(word);

            if (isOwnerToken) {
                expect(foundWords).toContainEqual(ownerWord);
            }

            expect(foundWords).toContainEqual(word);

            expect(res.body.errors).toBeUndefined();
        });
    };

    beforeAll(async () => {
        await wordGroupAccessFactory.init();

        tc = wordGroupAccessFactory.toTestContent();

        wordInput = {
            wordGroupId: tc.wordGroup.id,
            value: 'text',
            translation: 'text translation',
            description: 'description',
            examples: ['example 1', 'example 2', 'example 3'],
        };

        ownerWordInput = {
            wordGroupId: tc.wordGroup.id,
            value: 'owner text',
            translation: 'owner text translation',
            description: 'owner description',
            examples: ['owner example 1', 'owner example 2', 'owner example 3'],
        };
    });

    afterAll(async () => {
        await userTestHelper.removeAllUsers(wordGroupAccessFactory.toUsers());
    });

    // ---------- Create Word Section ----------
    it('user with CAN_VIEW share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role cannot add the word', () => {
        return negativeTestCreateWithRole(tc.updateContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can add the word', () => {
        return positiveTestCreateWithRole(tc.addContentUser.token);
    });

    it('workspace owner can add the word group', () => {
        return positiveTestCreateWithRole(tc.owner.token);
    });

    // ---------- View One Word Group Section ----------
    it('user with CAN_VIEW share role can view the word', () => {
        return positiveTestFindWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role can view the word', () => {
        return positiveTestFindWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role can view the word', () => {
        return positiveTestFindWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot view the word', () => {
        return negativeTestFindWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can view the word', () => {
        return positiveTestFindWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can view the word', () => {
        return positiveTestFindWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can view word', () => {
        return positiveTestFindWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can view the word group', () => {
        return positiveTestFindWithRole(tc.owner.token);
    });

    // ---------- View All Word Groups Section ----------
    it('user with CAN_VIEW share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot view the word group in the list', () => {
        return negativeTestFindAllWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role can view the word group in the list', () => {
        return positiveTestFindAllWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can view word group in the list', () => {
        return positiveTestFindAllWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can view the word group', () => {
        return positiveTestFindAllWithRole(tc.owner.token);
    });

    // ---------- Update Word Section ----------
    it('user with CAN_VIEW share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_REMOVE_CONTENT share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.removeContentUser.token);
    });

    it('user with CAN_ADD_CONTENT share role cannot update the word', () => {
        return negativeTestUpdateWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role can update word', () => {
        return positiveTestUpdateWithRole(tc.updateContentUser.token);
    });

    it('workspace owner can update the word group', () => {
        return positiveTestUpdateWithRole(tc.owner.token);
    });

    // ---------- Remove Word Section ----------
    it('user with CAN_VIEW share role cannot remove the word', () => {
        return negativeTestRemoveWithRole(tc.viewUser.token);
    });

    it('user with CAN_UPDATE share role cannot remove the word', () => {
        return negativeTestRemoveWithRole(tc.updateUser.token);
    });

    it('user with CAN_REMOVE share role cannot remove the word', () => {
        return negativeTestRemoveWithRole(tc.removeUser.token);
    });

    it('user with NO share role cannot remove the word', () => {
        return negativeTestRemoveWithRole(tc.noRolesUser.token);
    });

    it('user with CAN_ADD_CONTENT share role cannot remove the word', () => {
        return negativeTestRemoveWithRole(tc.addContentUser.token);
    });

    it('user with CAN_UPDATE_CONTENT share role cannot remove word', () => {
        return negativeTestRemoveWithRole(tc.updateContentUser.token);
    });

    it('owner can remove word', () => {
        return positiveTestRemoveWithRole(ownerWord.id, tc.owner.token);
    });

    it('user with CAN_REMOVE_CONTENT share role can remove word', () => {
        return positiveTestRemoveWithRole(word.id, tc.removeContentUser.token);
    });
});
