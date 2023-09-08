import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

import { UserService } from '../service/user.service';
import { UserInput } from '../dto/user.input';
import { UserResponseModel } from '../model/user-response.model';
import { AppLogger } from '../../shared/logger/app.logger';
import { UsernameUniquenessResponseModel } from '../model/username-uniqueness-response.model';
import { UsernameUniquenessInput } from '../dto/username-uniqueness.input';

@Resolver()
export class AuthResolver {
    private logger: Logger = new AppLogger(AuthResolver.name);

    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserResponseModel)
    login(@Args('userInput') userInput: UserInput): Promise<UserResponseModel> {
        this.logger.log({ data: userInput, action: this.login.name });

        return this.userService.login(userInput);
    }

    @Mutation(() => UserResponseModel)
    register(@Args('userInput') userInput: UserInput): Promise<UserResponseModel> {
        this.logger.log({ data: userInput, action: this.register.name });

        return this.userService.register(userInput);
    }

    @Query(() => UsernameUniquenessResponseModel)
    async usernameUniqueness(@Args('usernameUniquenessInput') usernameUniquenessInput: UsernameUniquenessInput): Promise<UsernameUniquenessResponseModel> {
        this.logger.log({ data: usernameUniquenessInput, action: this.usernameUniqueness.name });

        return this.userService.usernameUniqueness(usernameUniquenessInput.username);
    }
}
