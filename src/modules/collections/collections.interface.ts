interface InputCollection {
    words: {
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        name: string;
        description: string | null;
        type: string;
        userId: string;
        collectionVocabularies: {
            id: string;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
            collectionId: string;
            vocabularyId: string;
            vocabulary: {
                id: string;
                createdAt: string;
                updatedAt: string;
                deletedAt: string | null;
                word: string;
                meaning: string;
                definition: string;
                pronunciation: string;
                exampleSentence: string;
                partOfSpeech: string;
                audio: string;
            };
        }[];
    }[];
}

interface OutputWord {
    audio: string;
    definition: string;
    exampleSentence: string;
    meaning: string;
    partOfSpeech: string;
    pronunciation: string;
    word: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

