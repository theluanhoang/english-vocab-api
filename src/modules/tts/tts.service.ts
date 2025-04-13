import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WordCollection, WordDetails } from '../gemini/gemini.interface';
import { LanguageCode } from 'src/types';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TtsService {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }

  private generateSignature(words: WordDetails[]): string {
    const secretKey = this.configService.get<string>('HMAC_SECRET_KEY') || '';
    
    const payload = JSON.stringify(words, Object.keys(words[0]).sort());
    
    return crypto
      .createHmac('sha256', secretKey.trim())
      .update(payload)
      .digest('hex');
  }

  async convertWordsWithAudio(data: {
    collection: string;
    lang?: LanguageCode;
    words: WordDetails[];
  }): Promise<WordCollection> {
    try {      
      const signature = this.generateSignature(data.words);
      
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:5000/api/tts', {
          ...data,
          signature,
        }, {
          headers: {
            'X-API-Key': this.configService.get('API_KEY', ''),
            'Content-Type': 'application/json',
          },
        }),
      );

      const audioResults: WordCollection = response.data;
      return audioResults;
    } catch (error) {
      switch (error.response?.status) {
        case 401:
          throw new UnauthorizedException('Invalid or missing API Key');
        case 400:
          throw new BadRequestException(error.response?.data?.error || 'Invalid request data');
        case 403:
          throw new BadRequestException(error.response?.data?.error || 'Forbidden: IP not allowed');
        default:
          throw new Error(`TTS API request failed: ${error.message}`);
      }
    }
  }
}