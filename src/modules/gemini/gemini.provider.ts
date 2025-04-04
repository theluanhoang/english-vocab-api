import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GEMINI_FLASH_MODEL, GEMINI_PRO_EXP } from './gemini.constant';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from 'src/configs/gemini.config';
import { ConfigService } from '@nestjs/config';

export const GeminiFlashModelProvider: Provider<GenerativeModel> = {
    provide: GEMINI_FLASH_MODEL,
    useFactory: (configService: ConfigService) => {
        const genAI = new GoogleGenerativeAI(configService.get<string>('GEMINI_API_KEY')!);
        return genAI.getGenerativeModel({
            model: configService.get<string>('GEMINI_FLASH_MODEL', 'gemini-2.0-flash'),
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
        });
    },
    inject: [ConfigService],
};

export const GeminiProExpModelProvider: Provider<GenerativeModel> = {
    provide: GEMINI_PRO_EXP,
    useFactory: (configService: ConfigService) => {
        const genAI = new GoogleGenerativeAI(configService.get<string>('GEMINI_API_KEY')!);
        return genAI.getGenerativeModel({
            model: configService.get<string>('GEMINI_PRO_EXP', 'gemini-2.5-pro-exp-03-25'),
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
        });
    },
    inject: [ConfigService],
};