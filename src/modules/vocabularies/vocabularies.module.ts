import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabularies.controller';
import { VocabularyService } from './vocabularies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { GeminiModule } from '../gemini/gemini.module';
import { CollectionsModule } from '../collections/collections.module';
import { TtsModule } from '../tts/tts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary]), GeminiModule, TtsModule, CollectionsModule],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService]
})
export class VocabularyModule {}
