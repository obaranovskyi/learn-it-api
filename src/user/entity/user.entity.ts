import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, ID } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserResponseModel } from '../model/user-response.model';
import { WorkspaceEntity } from '../../workspace/entity/workspace.entity';
import { ShareWorkspaceEntity } from '../../workspace/entity/share-workspace.entity';

@ObjectType()
@Entity('users')
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
        type: 'varchar',
        unique: true,
        length: 100,
    })
    username: string;

    @Field()
    @Column('text')
    password: string;

    @Field(() => [WorkspaceEntity])
    @OneToMany(() => WorkspaceEntity, (workspaces: WorkspaceEntity) => workspaces.owner)
    workspaces: WorkspaceEntity[];

    @Field(() => [ShareWorkspaceEntity])
    @OneToMany(() => ShareWorkspaceEntity, (sharedWorkspace: ShareWorkspaceEntity) => sharedWorkspace.user)
    sharedWorkspaces: ShareWorkspaceEntity[];

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject(showToken: boolean = true): UserResponseModel {
        const { id, created, updated, username, token } = this;
        const responseObject: UserResponseModel = { id, created, username, updated };

        if (showToken) responseObject.token = token;

        return responseObject;
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token(): string {
        const { id, username } = this;
        return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
    }
}
