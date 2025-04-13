import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, QueryRunner, RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { CollectionsService } from '../collections/collections.service';
import { Vocabulary } from './entities/vocabulary.entity';
import { GeminiService } from '../gemini/gemini.service';
import { NoteWordDTO } from './dto/note-word.dto';
import { ECollectionType } from '../collections/collections.enum';
import { EMessageError } from 'src/shared/common';
import { TtsService } from '../tts/tts.service';
import { WordCollection } from '../gemini/gemini.interface';
import { SaveWordDTO } from './dto/save-word.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepository: Repository<Vocabulary>,
    private readonly ttsService: TtsService,
    private readonly geminiService: GeminiService,
    private readonly collectionsService: CollectionsService,
    private readonly dataSource: DataSource,
  ) { }

  async getVariants(word: string): Promise<WordCollection> {
    const varsCollection = await this.geminiService.getWordDetailsAndVariants(word);
    const updatedVarCollection = await this.ttsService.convertWordsWithAudio({ collection: varsCollection.collection, lang: 'en', words: varsCollection.words });

    return updatedVarCollection;
  }

  async save(dto: SaveWordDTO, queryRunner?: QueryRunner): Promise<Vocabulary> {
    const repository = queryRunner ? queryRunner.manager.getRepository(Vocabulary) : this.vocabularyRepository;

    return repository.save(dto);
  }

  async noteWord(dto: NoteWordDTO, userId: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingVocab = await this.getOne({
        where: { word: dto.word },
        relations: ['collectionVocabularies', 'collectionVocabularies.collection']
      });      
  
      if (existingVocab) {        
        const parentCollection = existingVocab.collectionVocabularies.find(
          (cv) => cv.collection.type === ECollectionType.FORM,
        );
        
        if (parentCollection) {          
          const words = await this.collectionsService.getCollectionWords(parentCollection.collectionId);
          await queryRunner.commitTransaction();
          return { info: parentCollection.collection, words };
        }
      }

      let currCollection = await this.collectionsService.getOne({
        where: {
          name: dto.word,
          user: {
            id: userId
          }
        }
      });

      if (!currCollection) {
        const { collection, words } = await this.createNewFormCollection(dto, userId, queryRunner);

        return {
          collection,
          words
        }
      }      
      const vocabs = await this.collectionsService.getCollectionWords(currCollection.id);

      await queryRunner.commitTransaction();

      return {
        collection: currCollection,
        words: vocabs
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      } else {
        throw new Error(`Failed to process word: ${error.message}`);
      }
    } finally {
      await queryRunner.release();
    }
  }

  private async createNewFormCollection(dto: NoteWordDTO, userId: string, queryRunner: QueryRunner) {
    const newCollection = await this.collectionsService.create(userId, {
      name: dto.word,
      type: ECollectionType.FORM
    }, queryRunner);
  
    const variants = await this.getVariants(dto.word);
    const savedVariants = await queryRunner.manager.getRepository(Vocabulary).save(variants.words);
  
    await Promise.all(savedVariants.map(variant =>
      this.collectionsService.linkWordToCollection(newCollection.id, variant.id, queryRunner)
    ));
  
    return { collection: newCollection, words: savedVariants };
  }

  async getOne(options: FindOneOptions<Vocabulary>): Promise<Vocabulary | null> {
    return this.vocabularyRepository.findOne(options);
  }

  async getOneOrThrow(options: FindOneOptions<Vocabulary>): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findOne(options);

    if (!vocabulary) {
      throw new BadRequestException(EMessageError.VOCABULARY_NOT_FOUND);
    }

    return vocabulary;
  }

  async getVocabulariesByCollectionType(word: string, collectionType: ECollectionType) {
    switch (collectionType) {
      case ECollectionType.FORM:
        return this.getVariants(word);
      default:
        return [];
    }
  }
}