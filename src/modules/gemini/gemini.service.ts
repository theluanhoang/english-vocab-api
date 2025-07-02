import { Inject, Injectable } from '@nestjs/common';
import { GEMINI_FLASH_MODEL } from './gemini.constant';
import { GenerativeModel } from '@google/generative-ai';
import { WordCollection } from './gemini.interface';

@Injectable()
export class GeminiService {
  constructor(
    @Inject(GEMINI_FLASH_MODEL) private readonly flashModel: GenerativeModel,
  ) { }

  async getWordDetailsAndVariants(word: string): Promise<WordCollection> {
    // const prompt = `
    //   You are a JSON-only API. Provide strictly a one-line valid JSON object containing detailed linguistic data for the English word "${word}" and **at least four** of its commonly used morphological variants.

    //   **Response Format (Single Line, No Markdown, No Code Block, No Explanation, No Newline):**
    //   {"collection":"${word}","words":[{"word":"${word}","meaning":"<Vietnamese meaning>","definition":"<English definition>","pronunciation":"<IPA>","partOfSpeech":"<Part of speech>","audio":"<Audio URL>","exampleSentence":"<Usage sentence>"},{"word":"<Variant 1>",...},...,{"word":"<Variant 4>",...}]}

    //   **Strict Instructions:**
    //   - Output must be valid JSON, in a single line.
    //   - Do NOT include code blocks, markdown, newlines, backticks, or explanations.
    //   - The "words" array must have at least 5 objects (the base word + 4 variants).
    //   - Include different parts of speech (noun, verb, adj, adv, participle).
    //   - If no real audio URL, use placeholder: "https://example.com/audio/<word>.mp3".
    //   `
    //   ;
    const prompt = `
      You are a JSON-only API. Provide strictly a one-line valid JSON object containing detailed linguistic data for the English word "${word}" and **at least four** of its commonly used morphological variants.

      **Response Format (Single Line, No Markdown, No Code Block, No Explanation, No Newline):**
      {"collection":"${word}","words":[{"word":"${word}","meaning":"<Vietnamese meaning>","definition":"<English definition>","pronunciation":"<IPA>","partOfSpeech":"<Part of speech>","audio":"<Audio URL>","exampleSentence":"<Usage sentence>","translatedExample":"<Vietnamese translation of the example>"},{"word":"<Variant 1>",...},...,{"word":"<Variant 4>",...}]}

      **Strict Instructions:**
      - Output must be valid JSON, in a single line.
      - Do NOT include code blocks, markdown, newlines, backticks, or explanations.
      - The "words" array must have at least 5 objects (the base word + 4 variants).
      - Include different parts of speech (noun, verb, adj, adv, participle).
      - If no real audio URL, use placeholder: "https://example.com/audio/<word>.mp3".
      `
    ;

    let text: string | undefined;

    try {
      const result = await this.flashModel.generateContent(prompt);
      const response = await result.response;
      text = response.text();

      const cleanedText = text
        .replace(/^```json\s*/, '')
        .replace(/```$/, '')
        .trim();

      const wordCollection: WordCollection = JSON.parse(cleanedText);
      if (
        !wordCollection.collection ||
        !Array.isArray(wordCollection.words) ||
        wordCollection.words.length === 0
      ) {
        throw new Error('Invalid response format from Gemini API');
      }

      for (const wordDetail of wordCollection.words) {
        if (
          !wordDetail.word ||
          !wordDetail.meaning ||
          !wordDetail.definition ||
          !wordDetail.pronunciation ||
          !wordDetail.partOfSpeech ||
          !wordDetail.audio ||
          !wordDetail.exampleSentence ||
          !wordDetail.translatedExample
        ) {
          throw new Error('Invalid word format in Gemini API response');
        }
      }

      if (!wordCollection.words.some(w => w.word === word)) {
        throw new Error('Root word must be included in words array');
      }

      wordCollection.words = wordCollection.words.filter(
        (w, index, self) => index === self.findIndex(v => v.word === w.word),
      );

      return wordCollection;
    } catch (error) {
      throw new Error(
        `Failed to get details for word "${word}": ${error.message}. Raw response: ${text ?? 'N/A'}`,
      );
    }
  }
}
