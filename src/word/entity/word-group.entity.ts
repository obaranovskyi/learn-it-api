import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Column,
} from 'typeorm';

import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { WordEntity } from './word.entity';
import { WordGroupResponseModel } from '../model/word-group-response.model';
import { WorkspaceEntity } from '../../workspace/entity/workspace.entity';

@ObjectType()
@Entity('word_groups')
export class WordGroupEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => [WordEntity])
    @OneToMany(() => WordEntity, (word: WordEntity) => word.wordGroup)
    words: WordEntity[];

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    @Field(() => WorkspaceEntity)
    @ManyToOne(() => WorkspaceEntity, (workspace: WorkspaceEntity) => workspace.sharedWorkspaces, { onDelete: 'CASCADE', eager: true })
    workspace: WorkspaceEntity;

    toResponseObject(): WordGroupResponseModel {
        const workspaceResponseObject = this.workspace.toResponseObject();

        return {
            id: this.id,
            created: this.created,
            updated: this.updated,
            name: this.name,
            workspaceId: this.workspace.id,
            workspaceOwnerId: workspaceResponseObject.ownerId,
            workspaceOwnerName: workspaceResponseObject.ownerName,
        };
    }
}
