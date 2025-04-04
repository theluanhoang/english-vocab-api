import { Inject, Injectable } from '@nestjs/common';
import { GEMINI_FLASH_MODEL, GEMINI_PRO_EXP } from './gemini.constant';
import { GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    constructor(
        @Inject(GEMINI_FLASH_MODEL) private readonly flashModel: GenerativeModel,
    ) {}

    async getWordVariants(word: string): Promise<string[]> {
        const prompt = `
            List all word forms of the word "${word}" (e.g., different grammatical forms like noun, verb, adjective, adverb). 
            Return only the words, one per line, with no explanations, numbers, synonyms, or additional text. Example for "certify":
            certification
            certified
            certificate
        `;
        
        const result = await this.flashModel.generateContent(prompt);
        const response = await result.response;
        
        const text = response.text();

        const variants = text
            .split('\n')
            .map((variant) => variant.trim())
            .filter((variant) => variant.length > 0);

        return variants;
    }
}
