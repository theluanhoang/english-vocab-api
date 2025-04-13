import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CollectionVocabulary } from 'src/modules/collections/entities/collection-vocabulary.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { ECollectionType } from '../collections.enum';

@Entity('collections')
export class Collection extends CommonEntity {

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ECollectionType})
  type: ECollectionType;

  @Column({ nullable: false, name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CollectionVocabulary, (collectionVocabulary) => collectionVocabulary.collection)
  collectionVocabularies: CollectionVocabulary[];
}