import { CollectionVocabulary } from 'src/modules/collections/entities/collection-vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
// import { CollectionVocabulary } from './collection-vocabulary.entity';
// import { Flashcard } from './flashcard.entity';
// import { PracticeResult } from './practice-result.entity';

@Entity('vocabulary')
export class Vocabulary extends CommonEntity {
  @Column()
  word: string;

  @Column()
  definition: string;

  @Column()
  pronunciation: string;

  @Column()
  exampleSentence: string;

  @Column()
  partOfSpeech: string;

  @OneToMany(() => CollectionVocabulary, (collectionVocabulary) => collectionVocabulary.vocabulary)
  collectionVocabularies: CollectionVocabulary[];

//   @OneToMany(() => Flashcard, (flashcard) => flashcard.vocabulary)
//   flashcards: Flashcard[];

//   @OneToMany(() => PracticeResult, (practiceResult) => practiceResult.vocabulary)
//   practiceResults: PracticeResult[];
}