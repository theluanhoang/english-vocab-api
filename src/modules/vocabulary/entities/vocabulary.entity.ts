import { CollectionVocabulary } from 'src/modules/collections/entities/collection-vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('vocabulary')
export class Vocabulary extends CommonEntity {
    @Column()
    word: string;

    @Column({nullable: true})
    meaning: string;

    @Column()
    definition: string;

    @Column()
    pronunciation: string;

    @Column()
    exampleSentence: string;

    @Column()
    partOfSpeech: string;

    @Column({ nullable: true })
    audio: string;

    @OneToMany(() => CollectionVocabulary, (collectionVocabulary) => collectionVocabulary.vocabulary)
    collectionVocabularies: CollectionVocabulary[];
}