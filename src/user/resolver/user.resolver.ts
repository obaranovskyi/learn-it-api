import { UseGuards, Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Context, Int } from '@nestjs/graphql';

import { UserService } from '../service/user.service';
import { UserResponseModel } from '../model/user-response.model';
import { AuthGuard } from '../../shared/guard/auth.guard';
import { JwtUserModel } from '../model/jwt-user.model';
import { AppLogger } from '../../shared/logger/app.logger';

@Resolver()
@UseGuards(AuthGuard)
export class UserResolver {
    private logger: Logger = new AppLogger(UserResolver.name);

    constructor(private readonly userService: UserService) {}

    @Query(() => [UserResponseModel])
    async findAllUsers(@Context('user') user: JwtUserModel): Promise<UserResponseModel[]> {
        this.logger.log({ action: this.findAllUsers.name, user });

        return this.userService.findAll();
    }

    @Mutation(() => Int)
    async removeUser(@Context('user') user: JwtUserModel): Promise<number> {
        this.logger.log({ action: this.removeUser.name, user });
        await this.userService.remove(user.id);

        return user.id;
    }
}
