export interface WordCollection {
    collection: string;
    words: WordDetails[];
  }
  
  export interface WordDetails {
    word: string;
    meaning: string;
    definition: string;
    pronunciation: string;
    partOfSpeech: string;
    audio: string;
    exampleSentence: string;
  }