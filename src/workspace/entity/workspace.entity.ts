import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    Entity,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { UserEntity } from '../../user/entity/user.entity';
import { WorkspaceResponseModel } from '../model/workspace-response.model';
import { ShareWorkspaceEntity } from './share-workspace.entity';
import { WordGroupEntity } from '../../word/entity/word-group.entity';

@ObjectType()
@Entity('workspaces')
export class WorkspaceEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('text')
    name: string;

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.workspaces, { onDelete: 'CASCADE', eager: true })
    owner: UserEntity;

    @Field(() => [ShareWorkspaceEntity])
    @OneToMany(() => ShareWorkspaceEntity, (sharedWorkspace: ShareWorkspaceEntity) => sharedWorkspace.workspace)
    sharedWorkspaces: ShareWorkspaceEntity[];

    @Field(() => [WordGroupEntity])
    @OneToMany(() => WordGroupEntity, (wordGroup: WordGroupEntity) => wordGroup.workspace)
    wordGroups: WordGroupEntity;

    toResponseObject(): WorkspaceResponseModel {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
            updated: this.updated,
            ownerId: this.owner.id,
            ownerName: this.owner.username,
        };
    }

    isOwner(userId: number): boolean {
        return this.owner.id === userId;
    }
}
