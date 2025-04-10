import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WordCollection, WordDetails } from '../gemini/gemini.interface';
import { LanguageCode } from 'src/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TtsService {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }

  async convertWordsWithAudio(data: {
    collection: string;
    lang?: LanguageCode;
    words: WordDetails[];
  }): Promise<WordCollection> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:5000/api/tts', data, {
          headers: {
            'X-API-Key': this.configService.get('API_KEY', ''),
            'Content-Type': 'application/json',
          },
        }),
      );

      const audioResults: WordCollection = response.data;
      console.log("AUDIORESULT:::", audioResults);

      return audioResults;
    } catch (error) {
      console.error('Error from TTS API:', error.response?.data || error.message); // Log lỗi chi tiết

      // Phân loại lỗi dựa trên mã trạng thái
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid or missing API Key');
      } else if (error.response?.status === 400) {
        throw new BadRequestException(error.response?.data?.error || 'Invalid request data');
      } else {
        throw new Error(`TTS API request failed: ${error.message}`);
      }
    }
  }
}