import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TtsService } from './tts.service';

@Module({
  imports: [HttpModule],
  providers: [TtsService],
  exports: [TtsService]
})
export class TtsModule {}
