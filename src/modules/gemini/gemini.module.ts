import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiFlashModelProvider, GeminiProExpModelProvider } from './gemini.provider';

@Module({
  providers: [
    GeminiService,
    GeminiFlashModelProvider,
    GeminiProExpModelProvider,
  ],
  exports: [GeminiService],
})
export class GeminiModule {}