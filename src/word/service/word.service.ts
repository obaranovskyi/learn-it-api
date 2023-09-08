import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ExistingWordInput } from '../dto/existing-word.input';
import { ShareWorkspaceRolesEnum, getAllShareWorkspaceRoles } from '../../workspace/enum/share-workspace-roles.enum';
import { Validation } from '../../shared/constants/validation.constants';
import { WordEntity } from '../entity/word.entity';
import { WordGroupService } from './word-group.service';
import { WordInput } from '../dto/word.input';
import { WordResponseModel } from '../model/word-response.model';

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(WordEntity) private readonly wordRepository: Repository<WordEntity>,
        private readonly wordGroupService: WordGroupService
    ) {}

    async findOne(wordId: number, userId: number): Promise<WordResponseModel> {
        const word = await this.getWordOrThrowBadRequest(wordId, true);
        const workspaceId = word.wordGroup.workspace.id;

        await this.wordGroupService.verifyRightsOrThrowUnauthorized(workspaceId, userId, getAllShareWorkspaceRoles());

        return word.toResponseObject();
    }

    async findAll(wordGroupId: number, userId: number): Promise<WordResponseModel[]> {
        const wordGroup = await this.wordGroupService.getWordGroupOrThrowBadRequest(wordGroupId);

        await this.wordGroupService.verifyRightsOrThrowUnauthorized(
            wordGroup.workspace.id,
            userId,
            getAllShareWorkspaceRoles()
        );

        const words = await this.wordRepository.find({ where: { wordGroup: { id: wordGroupId } } });

        return words.map((word: WordEntity) => {
            return word.toResponseObject();
        });
    }

    async create(wordInput: WordInput, userId: number): Promise<WordResponseModel> {
        const wordGroup = await this.wordGroupService.getWordGroupOrThrowBadRequest(wordInput.wordGroupId);

        await this.wordGroupService.verifyRightsOrThrowUnauthorized(
            wordGroup.workspace.id,
            userId,
            ShareWorkspaceRolesEnum.CAN_ADD_CONTENT
        );

        await this.wordGroupService.throwBadRequestIfNameReserved(wordInput.wordGroupId, wordInput.value);

        const createdWord = this.wordRepository.create({
            originalValue: wordInput.value,
            translation: wordInput.translation,
            description: wordInput.description,
            wordGroup,
        });
        await this.wordRepository.save(createdWord);

        // TODO: Add the ability to add examples along with the word.

        return createdWord.toResponseObject();
    }

    async update(wordInput: ExistingWordInput, userId: number): Promise<WordResponseModel> {
        const word = await this.getWordOrThrowBadRequest(wordInput.wordId);
        const wordGroup = await this.wordGroupService.getWordGroupOrThrowBadRequest(wordInput.wordGroupId);

        const roleToConsider =
            wordInput.wordGroupId === wordGroup.id
                ? ShareWorkspaceRolesEnum.CAN_UPDATE_CONTENT
                : ShareWorkspaceRolesEnum.CAN_ADD_CONTENT;

        await this.wordGroupService.verifyRightsOrThrowUnauthorized(wordGroup.workspace.id, userId, roleToConsider);

        await this.wordGroupService.throwBadRequestIfNameReserved(wordGroup.id, wordInput.value);

        const updatedWord = this.wordRepository.merge(word, {
            description: wordInput.description,
            originalValue: wordInput.value,
            translation: wordInput.translation,
            wordGroup,
        });
        await this.wordRepository.save(updatedWord);

        // TODO: Possible to update examples along with the word

        return updatedWord.toResponseObject();
    }

    async remove(wordId: number, userId: number): Promise<DeleteResult> {
        const word = await this.getWordOrThrowBadRequest(wordId, true);
        const wordGroup = await this.wordGroupService.getWordGroupOrThrowBadRequest(word.wordGroup.id);

        await this.wordGroupService.verifyRightsOrThrowUnauthorized(
            wordGroup.workspace.id,
            userId,
            ShareWorkspaceRolesEnum.CAN_REMOVE_CONTENT
        );

        return this.wordRepository.delete(wordId);
    }

    private async getWordOrThrowBadRequest(
        wordId: number,
        withGroupRelation: boolean = false
    ): Promise<WordEntity | never> {
        const query: any = { where: { id: wordId } };

        if (withGroupRelation) query.relations = ['wordGroup'];

        const word = await this.wordRepository.findOne(query);

        if (!word) throw new HttpException(Validation.BAD_REQUEST, HttpStatus.BAD_REQUEST);

        return word;
    }
}
