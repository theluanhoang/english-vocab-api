import { BadRequestException, Injectable } from '@nestjs/common';
import { CollectionVocabulary } from './entities/collection-vocabulary.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { UsersService } from '../users/users.service';
import { EMessageError } from 'src/shared/common';
import { CreateCollectionDTO } from './dto/create-collection.dto';
import { GetCollectionDTO } from './dto';
import { getLimitAndOffset } from 'src/shared/common/get-limit-offset';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionsRepository: Repository<Collection>,
        @InjectRepository(CollectionVocabulary)
        private collectionVocabularyRepository: Repository<CollectionVocabulary>,
        private userService: UsersService,
    ) { }

    async create(userId: string, createCollectionDTO: CreateCollectionDTO, queryRunner?: QueryRunner): Promise<Collection> {
        const { name, type } = createCollectionDTO;
        const repository = queryRunner ? queryRunner.manager.getRepository(Collection) : this.collectionsRepository;

        return repository.save({
            name,
            type,
            userId
        });
    }

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

    async linkWordToCollection(collectionId: string, vocabularyId: string, queryRunner?: QueryRunner): Promise<CollectionVocabulary> {
        const repository = queryRunner ? queryRunner.manager.getRepository(CollectionVocabulary) : this.collectionVocabularyRepository;

        return repository.save({
            collectionId: collectionId,
            vocabularyId: vocabularyId,
        });
    }

    async getCollectionWords(collectionId: string): Promise<OutputWord[]> {
        const collectionWords = await this.collectionsRepository.find({
            where: { id: collectionId },
            relations: ['collectionVocabularies', 'collectionVocabularies.vocabulary'],
        });

        return this.transformData(collectionWords);

    }

    async getAllCollection(query: GetCollectionDTO, userId: string): Promise<Collection[]> {
        const { limit, offset } = getLimitAndOffset({
            limit: query?.limit,
            offset: query?.offset,
        });
    
        const where: FindOptionsWhere<Collection> = {
            userId,
            ...(query.collectionId && { id: query.collectionId }),
        };
    
        const collections = await this.collectionsRepository.find({
            where,
            relations: [
                'collectionVocabularies',
                'collectionVocabularies.vocabulary',
                'collectionVocabularies.collection'
            ],
            order: {
                createdAt: 'DESC'
            },
            take: limit,
            skip: offset,
        });        
    
        return collections;
    }
    

    async getOne(options: FindOneOptions<Collection>): Promise<Collection | null> {
        return this.collectionsRepository.findOne(options);
    }

    async getOneOrThrow(options: FindOneOptions<Collection>): Promise<Collection> {
        const collection = await this.collectionsRepository.findOne(options);

        if (!collection) {
            throw new BadRequestException(EMessageError.COLLECTION_NOT_FOUND);
        }

        return collection;
    }

    private transformData(input: Collection[]): OutputWord[] {
        const transformedWords = input.flatMap(collection =>
            collection.collectionVocabularies.map(cv => ({
                audio: cv.vocabulary.audio,
                definition: cv.vocabulary.definition,
                exampleSentence: cv.vocabulary.exampleSentence,
                meaning: cv.vocabulary.meaning,
                partOfSpeech: cv.vocabulary.partOfSpeech,
                pronunciation: cv.vocabulary.pronunciation,
                word: cv.vocabulary.word,
                id: cv.vocabulary.id,
                createdAt: new Date(cv.vocabulary.createdAt).toISOString(),
                updatedAt: new Date(cv.vocabulary.updatedAt).toISOString(),
                deletedAt: cv.vocabulary.deletedAt ? new Date(cv.vocabulary.deletedAt).toISOString() : null
            }))
        )

        return transformedWords;
    }

}
