import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Vocabulary } from 'src/modules/vocabulary/entities/vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity('collection_vocabulary')
export class CollectionVocabulary extends CommonEntity {
  @Column({ type: 'uuid' })
  collectionId: string;

  @Column({ type: 'uuid' })
  vocabularyId: string;

  @ManyToOne(() => Collection, (collection) => collection.collectionVocabularies)
  collection: Collection;

  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.collectionVocabularies)
  vocabulary: Vocabulary;
}