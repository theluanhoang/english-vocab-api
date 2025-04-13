import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Vocabulary } from 'src/modules/vocabularies/entities/vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity('collection_vocabularies')
export class CollectionVocabulary extends CommonEntity {
  @Column({ nullable: false, type: 'uuid', name: 'collection_id' })
  collectionId: string;

  @Column({ nullable: false, type: 'uuid', name: 'vocabulary_id' })
  vocabularyId: string;

  @ManyToOne(() => Collection, (collection) => collection.collectionVocabularies)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.collectionVocabularies)
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;
}