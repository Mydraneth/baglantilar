import clsx from "clsx";
import React from "react";
import connections from "../data/connections.json";
import { getUniqueIndexes } from "../util";

// rastgele 5 kategori çek
// bir liste yap
// listeyi random sortla
type Category = {
    category: string;
    words: string[];
    difficulty: string;
};

export default function WordsList() {
    const [selectedCats, setSelectedCats] = React.useState<Category[]>([]);
    const [selectedWords, setSelectedWords] = React.useState<string[]>([]);
    const [shuffledWords, setShuffledWords] = React.useState<string[]>([]);
    const [userWords, setUserWords] = React.useState<string[]>([]);

    function getRandomCats<T>(connections: T[], count: number): T[] {
        const indexes = getUniqueIndexes(connections.length, count);
        return indexes.map((i) => connections[i]);
    }

    React.useEffect(() => {
        const allCats = getRandomCats(connections, 4);
        setSelectedCats(allCats);
    }, []);

    React.useEffect(() => {
        const allWordsArray = selectedCats.flatMap((cat) => cat.words);
        setSelectedWords(allWordsArray);
    }, [selectedCats]);

    function shuffleArray<T>(array: T[]): T[] {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    React.useEffect(() => {
        setShuffledWords(shuffleArray(selectedWords));
    }, [selectedWords]);

    function wordSelect(word: string) {
        setUserWords((prevWords) =>
            prevWords.includes(word) ? prevWords : [...prevWords, word]
        );
    }

    const wordList = shuffledWords.map((word: string, index: number) => {
        const isSelected = userWords.includes(word);
        const wordClass = clsx("word", {
            selected: isSelected,
        });
        return (
            <button
                onClick={() => wordSelect(word)}
                className={wordClass}
                key={index}
            >
                {word}
            </button>
        );
    });

    return <div className="words-grid">{wordList}</div>;
}
