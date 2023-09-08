import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    Entity,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';

import { WordResponseModel } from '../model/word-response.model';
import { WordGroupEntity } from './word-group.entity';
import { WordExampleEntity } from './word-example.entity';

@ObjectType()
@Entity('words')
export class WordEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    originalValue: string;

    @Field()
    @Column()
    translation: string;

    @Field()
    @Column('text')
    description: string;

    @Field(() => WordGroupEntity)
    @ManyToOne(() => WordGroupEntity, (wordGroup: WordGroupEntity) => wordGroup.words, { onDelete: 'CASCADE' })
    wordGroup: WordGroupEntity;

    @Field(() => [WordExampleEntity])
    @OneToMany(() => WordExampleEntity, (example: WordExampleEntity) => example.word)
    examples: WordExampleEntity[];

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    toResponseObject(): WordResponseModel {
        return {
            id: this.id,
            created: this.created,
            updated: this.updated,
            value: this.originalValue,
            translation: this.translation,
            description: this.description,
            wordGroupId: this.wordGroup.id,
            examples: this.examples.map((example: WordExampleEntity) => {
                return example.toResponseObject();
            })
        };
    }
}
