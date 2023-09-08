import { PrimaryGeneratedColumn, CreateDateColumn, Column, Entity, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, ID, Field, GraphQLISODateTime } from '@nestjs/graphql';

import { WordEntity } from './word.entity';
import { WordExampleResponseModel } from '../model/word-example-response.model';

@ObjectType()
@Entity('word_examples')
export class WordExampleEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
      nullable: true
    })
    header?: string;

    @Field()
    @Column({
      type: 'text'
    })
    value: string;

    @Field()
    @Column({
      type: 'text',
      nullable: true
    })
    translation?: string;

    @Field()
    @Column({
      type: 'text',
      nullable: true
    })
    description?: string;

    @Field(() => WordEntity)
    @ManyToOne(() => WordEntity, (word: WordEntity) => word.examples, { onDelete: 'CASCADE' })
    word: WordEntity;

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    toResponseObject(): WordExampleResponseModel {
        return {
            id: this.id,
            created: this.created,
            updated: this.updated,
            header: this.header,
            value: this.value,
            translation: this.translation,
            description: this.description,
            wordId: this.word.id
        };
    }
}
