import { Injectable } from '@nestjs/common';
import { CollectionVocabulary } from './entities/collection-vocabulary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionsRepository: Repository<Collection>,
        @InjectRepository(CollectionVocabulary)
        private collectionVocabularyRepository: Repository<CollectionVocabulary>,
        private userService: UsersService
    ) { }

    async addCollection(userId: string, data: { name: string; description: string }): Promise<Collection> {
        const user = await this.userService.getOneOrThrow({
            where: {
                id: userId
            }
        })

        const collection = this.collectionsRepository.create({
            user,
            name: data.name,
            description: data.description,
        });

        return this.collectionsRepository.save(collection);
    }

    async linkWordToCollection(collectionId: string, vocabularyId: string): Promise<CollectionVocabulary> {
        const collectionVocabulary = this.collectionVocabularyRepository.create({
            collectionId: collectionId,
            vocabularyId: vocabularyId,
        });

        return this.collectionVocabularyRepository.save(collectionVocabulary);
    }

    async getCollectionWords(collectionId: string): Promise<CollectionVocabulary[]> {
        return this.collectionVocabularyRepository.find({
            where: { collectionId: collectionId },
            relations: ['vocabulary'],
        });
    }
}
