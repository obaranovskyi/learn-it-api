import { PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, Entity } from 'typeorm';
import { Field, ID, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

import { WordEntity } from '../../word/entity/word.entity';
import { WorkspaceEntity } from '../../workspace/entity/workspace.entity';
import { WordGroupEntity } from '../../word/entity/word-group.entity';
import { UserEntity } from '../../user/entity/user.entity';


// TODO: Under construction
@ObjectType()
@Entity('word_stats')
export class WordStatsEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => Int)
    @Column('int')
    durationInSeconds: number;

    // TODO: Under construction
    // @Field(() => WordEntity)
    // @ManyToOne(() => WordEntity, (word: WordEntity) => word.wordTests, { onDelete: 'CASCADE' })
    // word: WordEntity;

    // TODO: Under construction
    // @Field(() => WorkspaceEntity)
    // @ManyToOne(() => WorkspaceEntity, (workspace: WorkspaceEntity) => workspace.wordTests, { onDelete: 'CASCADE' })
    // workspace: WorkspaceEntity;

    // TODO: Under construction
    // @Field(() => WordGroupEntity)
    // @ManyToOne(() => WordGroupEntity, (wordGroup: WordGroupEntity) => wordGroup.wordTests, { onDelete: 'CASCADE' })
    // wordGroup: WordGroupEntity;

    // TODO: Under construction
    // @Field(() => UserEntity)
    // @ManyToOne(() => UserEntity, (user: UserEntity) => user.wordTests, { onDelete: 'CASCADE' })
    // user: UserEntity;
}
