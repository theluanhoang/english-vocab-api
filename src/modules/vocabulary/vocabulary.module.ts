import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { CollectionsModule } from '../collections/collections.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary]), GeminiModule, CollectionsModule],
  controllers: [VocabularyController],
  providers: [VocabularyService]
})
export class VocabularyModule {}
