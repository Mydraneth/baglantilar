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
    const [guessedWords, setGuessedWords] = React.useState<string[]>([]);
    const [gameInitialized, setGameInitialized] = React.useState(false);
    const [correctCategories, setCorrectCategories] = React.useState<
        Category[]
    >([]);
    const [wrongGuess, setWrongGuess] = React.useState(false);

    function getRandomCats<T>(connections: T[], count: number): T[] {
        const indexes = getUniqueIndexes(connections.length, count);
        return indexes.map((i) => connections[i]);
    }

    React.useEffect(() => {
        if (!gameInitialized) {
            const allCats = getRandomCats(connections, 4);
            setSelectedCats(allCats);
            setGameInitialized(true);
        }
    }, [gameInitialized]);

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
        const shuffled = shuffleArray(selectedWords);
        setShuffledWords(shuffled);
    }, [selectedWords]);

    const displayWords = shuffledWords.filter(
        (word) => !guessedWords.includes(word)
    );

    function toggleSelected(word: string) {
        setUserWords((prevWords) => {
            if (prevWords.includes(word)) {
                return prevWords.filter((w) => w !== word);
            } else if (prevWords.length < 4) {
                return [...prevWords, word];
            } else {
                return prevWords;
            }
        });
    }
    function newWords() {
        setGuessedWords([]);
        setCorrectCategories([]);
        setUserWords([]);
        setGameInitialized(false);
    }

    function checkConnection() {
        if (userWords.length !== 4) {
            alert("Lütfen 4 kelime seçin!");
            return;
        }

        // Find which category contains all 4 selected words
        const matchingCategory = selectedCats.find(
            (category) =>
                userWords.every((word) => category.words.includes(word)) &&
                userWords.length === category.words.length
        );

        if (matchingCategory) {
            console.log("Doğru tahmin:", matchingCategory);
            setGuessedWords((prev) => [...prev, ...userWords]);
            setCorrectCategories((prev) => [...prev, matchingCategory]);
            setUserWords([]);
            setWrongGuess(false); // Reset wrong guess state
        } else {
            // Show visual feedback instead of alert
            setWrongGuess(true);

            // Reset the animation after it completes
            setTimeout(() => {
                setWrongGuess(false);
                setUserWords([]); // Clear selection after animation
            }, 600); // Match the animation duration
        }
    }

    const wordList = displayWords.map((word: string) => {
        const isSelected = userWords.includes(word);
        const wordClass = clsx("word", {
            selected: isSelected,
            "wrong-guess": isSelected && wrongGuess,
        });
        return (
            <button
                onClick={() => toggleSelected(word)}
                className={wordClass}
                key={word}
            >
                {word}
            </button>
        );
    });

    return (
        <>
            <div className="words-grid">{wordList}</div>
            <div className="buttons">
                <button className="cat-checker" onClick={checkConnection}>
                    Bu alaka mı?
                </button>
                <button className="new-words" onClick={newWords}>
                    Yeni kelimeler?
                </button>
            </div>
            <div className="correct-categories">
                {correctCategories.map((category) => (
                    <div key={category.category} className="correct-category">
                        <h3>{category.category}</h3>
                        <div className="category-words">
                            {category.words.map((word) => (
                                <span key={word} className="correct-word">
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
