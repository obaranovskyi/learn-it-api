import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../entity/user.entity';
import { UserResponseModel } from '../model/user-response.model';
import { PasswordErrorCodes } from '../../shared/validators/password-error-codes.enum';
import { PasswordValidation } from '../../shared/validators/password-validation';
import { EntryValidation } from '../../shared/validators/entry-validation';
import { UserInput } from '../dto/user.input';
import { CredentialsValidation } from '../constants/credential-validation.constants';
import { UsernameUniquenessResponseModel } from '../model/username-uniqueness-response.model';
import { WorkspaceService } from '../../workspace/service/workspace.service';
import { WordGroupService } from '../../word/service/word-group.service';
import { DEFAULT_WORKSPACE_NAME } from '../../workspace/workspace.constants';
import { DEFAULT_WORD_NAME } from '../../word/word.constants';


@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      private readonly workspaceService: WorkspaceService,
      private readonly wordGroupService: WordGroupService
    ) {}

    async findAll(): Promise<UserResponseModel[]> {
        const users = await this.userRepository.find();

        return users.map((user: UserEntity) => {
            return user.toResponseObject(false);
        });
    }

    async usernameUniqueness(username: string): Promise<UsernameUniquenessResponseModel> {
      const user = await this.userRepository.findOneBy({ username });

      return { exists: Boolean(user) };
    }

    async login({ username, password }: UserInput): Promise<UserResponseModel> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password)))
            throw new HttpException(CredentialsValidation.INVALID_USERNAME_PASSWORD, HttpStatus.BAD_REQUEST);

        return user.toResponseObject();
    }

    async register({ password, username }: UserInput): Promise<UserResponseModel> {
        const passwordValidation: EntryValidation<PasswordErrorCodes> = new PasswordValidation(password);
        if (!passwordValidation.satisfy()) {
            throw new HttpException(passwordValidation.unsatisfied(), HttpStatus.BAD_REQUEST);
        }

        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        user = this.userRepository.create({ password, username });
        await this.userRepository.save(user);

        this.setupUserDefaultEnvironment(user);

        return user.toResponseObject();
    }

    async setupUserDefaultEnvironment(user: UserEntity): Promise<void> {
        const workspace = await this.workspaceService.create(user.id, { name: DEFAULT_WORKSPACE_NAME });
        await this.wordGroupService.create({ workspaceId: workspace.id, groupName: DEFAULT_WORD_NAME }, user.id);
    }

    async remove(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new HttpException(`User with given id doesn't exist`, HttpStatus.NOT_FOUND);
        }

        await this.userRepository.delete(id);

        return;
    }
}
