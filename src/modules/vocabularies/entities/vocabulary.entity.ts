import { CollectionVocabulary } from 'src/modules/collections/entities/collection-vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('vocabularies')
export class Vocabulary extends CommonEntity {
    @Column()
    word: string;

    @Column({nullable: true})
    meaning: string;

    @Column()
    definition: string;

    @Column()
    pronunciation: string;

    @Column({ name: 'example_sentence' })
    exampleSentence: string;

    @Column({ name: 'part_of_speech' })
    partOfSpeech: string;

    @Column({ nullable: true })
    audio: string;

    @OneToMany(() => CollectionVocabulary, (collectionVocabulary) => collectionVocabulary.vocabulary)
    collectionVocabularies: CollectionVocabulary[];
}