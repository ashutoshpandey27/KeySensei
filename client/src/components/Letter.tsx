import React from "react";
import { useGameContext } from "../context/GameContext";

type LetterProps = {
  char: String;
  letterIndx: number;
  wordIndx: number;
};

export function Letter({ char, letterIndx, wordIndx }: LetterProps) {
  const { lettersClassNames } = useGameContext();

  return (
    <>
      <span className={lettersClassNames[wordIndx][letterIndx]}>{char}</span>
    </>
  );
}

export default Letter;
