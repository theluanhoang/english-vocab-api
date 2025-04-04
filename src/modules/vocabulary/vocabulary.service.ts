import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionsService } from '../collections/collections.service';
import { Vocabulary } from './entities/vocabulary.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepository: Repository<Vocabulary>,
    private collectionsService: CollectionsService,
    private geminiService: GeminiService
  ) {}

  async noteWord(userId: string, word: string): Promise<string[]> {
    // Using OpenAI Service To Generate word
    const variants = await this.geminiService.getWordVariants(word);
    variants.forEach((variant, index) => {
        
    })
    // 

    return variants
  }
}