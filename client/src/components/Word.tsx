import React from "react";
import { useGameContext } from "../context/GameContext";
import { Letter } from "./Letter";

type WordProps = {
  wordIndx: number;
};

export function Word({ wordIndx }: WordProps) {
  const { wordsDisplayTexts, wordsClassNames } = useGameContext();

  return (
    <>
      <div className={wordsClassNames[wordIndx]}>
        {wordsDisplayTexts[wordIndx].split("").map((letter, letterIndx) => (
          <Letter
            key={letterIndx}
            wordIndx={wordIndx}
            letterIndx={letterIndx}
            char={letter}
          />
        ))}
      </div>
    </>
  );
}

export default Word;
