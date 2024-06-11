import React from "react";
import { useCallback, useEffect } from "react";
import { ReactNode, createContext, useContext, useState } from "react";
import { wordsGenerator } from "../utilities/wordsGenerator";
import { calculateWPM } from "../utilities/gameLogic";
import { saveScore } from "../services/scoreService";
// import { cursorTo } from "readline";

type GameContextProviderProps = {
  children: ReactNode;
};

// values provided to the components
type GameContext = {
  currLetterIdx: number; // Index of the current letter
  currWordIdx: number; // Index of the current word
  gameWords: string[]; // Array of words for the game
  gameStarted: boolean; // Boolean indicating if the game has started
  gameFinished: boolean; // Boolean indicating if the game has finished
  isLoading: boolean; // Boolean indicating if the game is loading
  startingTime: number; // Start time of the game
  timer: number; // Timer value for the game
  wordsClassNames: string[]; // Array of class names for words
  wordsDisplayTexts: string[]; // Array of display texts for words
  lettersClassNames: string[][]; // Array of arrays of class names for letters
  wpm: number; // Words per minute value
  fetchWordsAndInitialize: () => void; // Function to fetch words and initialize the game
  startGame: () => void; // Function to start the game
  stopGame: () => void; // Function to stop the game
  setStartingTime: (time: number) => void;
};

export const GameContext = createContext({} as GameContext);

export function useGameContext() {
  return useContext(GameContext);
}

// provides context to components
export function GameContextProvider({ children }: GameContextProviderProps) {
  // const startingTime = 30; // seconds

  const [startingTime, setStartingTime] = useState<number>(45);
  const numWords = 400;
  const difficulty = "easy";

  const [gameWords, setGameWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState<number>(startingTime);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [currLetterIdx, setCurrLetterIndx] = useState<number>(0);
  const [currWordIdx, setCurrWordIndx] = useState<number>(0);
  const [lettersClassNames, setLettersClassNames] = useState<string[][]>([]);
  const [wordsDisplayTexts, setWordsDisplayTexts] = useState<string[]>([]);
  const [wordsClassNames, setWordsClassNames] = useState<string[]>([]);
  const [wpm, setWPM] = useState<number>(0);

  const handleSetStartingTime = (time: number) => {
    setStartingTime(time);
  };

  // set/reset game to initial state values
  const fetchWordsAndInitialize = async () => {
    setIsLoading(true);
    try {
      const newWords = await wordsGenerator(numWords, difficulty);
      setGameWords(newWords);
      setWordsClassNames(new Array(newWords.length).fill("word"));
      setWordsDisplayTexts(newWords);
      setLettersClassNames(
        newWords.map((word) => new Array(word.length).fill("word"))
      );

      setIsLoading(false);
      setTimer(startingTime);
      setGameStarted(false);
      setGameFinished(false);
      setCurrWordIndx(0);
      setCurrLetterIndx(0);
    } catch (err) {
      console.error("Error fetching words:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWordsAndInitialize();
  }, []);

  const handleKeyPress = useCallback(
    (ev: KeyboardEvent) => {
      const key = ev.key;
      const ctrlPressed = ev.ctrlKey;
      const isLetter = key.length === 1 && key.match(/[a-z]/i);
      const isSpace = key === " ";
      const isBackspace = key === "Backspace";

      if (gameFinished) {
        return;
      } else if (!gameStarted && isLetter) {
        startGame();
      }

      if (isLetter) {
        handleLetterKey(key);
      } else if (isSpace) {

        ev.preventDefault();
        handleSpacebarKey();

      } else if (isBackspace) {
        handleBackspaceKey(ctrlPressed);
      }
    },
    [gameFinished, gameStarted, currWordIdx, currLetterIdx, gameWords]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted) {
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      } else {
        stopGame();
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [gameStarted, timer]);

  const checkAndUpdateWordClassNames = () => {
    let isWordCorrect = true;

    for (let i = 0; i < lettersClassNames[currWordIdx].length; i++) {
      if (lettersClassNames[currWordIdx][i] !== "letter correct") {
        isWordCorrect = false;
        break;
      }
    }

    const newWordsClassNames = [...wordsClassNames];
    newWordsClassNames[currWordIdx] = isWordCorrect ? "word" : "word incorrect";
    setWordsClassNames(newWordsClassNames);
  };

  const handleLetterKey = (key: string) => {
    const currWord = gameWords[currWordIdx];
    let newLettersClassNames = [...lettersClassNames];
    let newDisplayTexts = [...wordsDisplayTexts];

    if (key === currWord[currLetterIdx]) {
      newLettersClassNames[currWordIdx][currLetterIdx] = "letter correct";
    } else if (currLetterIdx >= currWord.length) {
      newDisplayTexts[currWordIdx] = newDisplayTexts[currWordIdx] + key;
      newLettersClassNames[currWordIdx].push("letter incorrect extra");
    } else {
      newLettersClassNames[currWordIdx][currLetterIdx] = "letter incorrect";
    }

    setWordsDisplayTexts(newDisplayTexts);
    setLettersClassNames(newLettersClassNames);
    setCurrLetterIndx((prevIndx) => prevIndx + 1);
  };

  const handleSpacebarKey = () => {
    if (currLetterIdx === 0) return;

    const currWord = gameWords[currWordIdx];
    let newLettersClassNames = [...lettersClassNames];

    if (currLetterIdx < currWord.length) {
      for (let i = currLetterIdx; i < currWord.length; i++) {
        newLettersClassNames[currWordIdx][i] = "letter incorrect";
      }
    }

    setLettersClassNames(newLettersClassNames);
    checkAndUpdateWordClassNames();
    setCurrWordIndx(currWordIdx + 1);
    setCurrLetterIndx(0);
  };

  const handleBackspaceKey = (ctrlPressed: boolean) => {
    if (currLetterIdx == 0) {
      return;
    }
    const currWord = gameWords[currWordIdx];
    const currDisplayTextLength = wordsDisplayTexts[currWordIdx].length;
    let newLettersClassNames = [...lettersClassNames];
    let newDisplayTexts = [...wordsDisplayTexts];
    let newLetterIndx = currLetterIdx;

    if (ctrlPressed) {
      // reset current word and move to first letter indx
      newDisplayTexts[currWordIdx] = currWord;
      newLettersClassNames[currWordIdx] = new Array(currWord.length).fill(
        "letter"
      );
      newLetterIndx = 0;
    } else if (currDisplayTextLength != currWord.length) {
      newDisplayTexts[currWordIdx] = newDisplayTexts[currWordIdx].substring(
        0,
        currDisplayTextLength - 1
      );
      newLettersClassNames[currWordIdx].pop();
      newLetterIndx -= 1;
    } else {
      newLettersClassNames[currWordIdx][currLetterIdx - 1] = "letter";
      newLetterIndx -= 1;
    }

    setWordsDisplayTexts(newDisplayTexts);
    setLettersClassNames(newLettersClassNames);
    setCurrLetterIndx(newLetterIndx);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimer(startingTime);
  };

  const stopGame = async () => {
    const score = calculateWPM(currWordIdx, wordsClassNames, startingTime);
    setWPM(score);
    await saveScore("testUser", score);
    setGameFinished(true);
  };

  return (
    <GameContext.Provider
      value={{
        currLetterIdx,
        currWordIdx,
        gameWords,
        gameStarted,
        gameFinished,
        isLoading,
        startingTime,
        timer,
        wordsClassNames,
        lettersClassNames,
        wordsDisplayTexts,
        wpm,
        fetchWordsAndInitialize,
        startGame,
        stopGame,
        setStartingTime: handleSetStartingTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
