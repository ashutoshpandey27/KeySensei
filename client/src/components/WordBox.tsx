import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Word from "./Word";
import Cursor from "./Cursor";
import { debounce } from "lodash";
import { useGameContext } from "../context/GameContext";

type WordBoxProps = {};

export function WordBox({}: WordBoxProps) {
  const { currLetterIdx, currWordIdx, gameWords, wordsClassNames, isLoading } =
    useGameContext();

  const wordBoxRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const updateScrollPosition = useCallback(() => {
    if (isLoading) return;

    if (wordBoxRef.current) {
      const currentWordElement = wordBoxRef.current.children[currWordIdx];
      currentWordElement.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [currWordIdx]);

  const updateCursorPosition = useCallback(() => {
    if (wordBoxRef.current) {
      const currWordElement = wordBoxRef.current.children[currWordIdx];

      if (currWordElement) {
        const currLetterElement = currWordElement.children[currLetterIdx];
        const prevLetterElement = currWordElement.children[currLetterIdx - 1];

        // update cursor to left to current letter or the end of the current word
        if (currLetterElement) {
          const letterTop = currLetterElement.getBoundingClientRect().top + 2;
          const letterLeft = currLetterElement.getBoundingClientRect().left;
          setCursorPosition({ top: letterTop, left: letterLeft });
        } else {
          const prevLetterTop =
            prevLetterElement.getBoundingClientRect().top + 2;
          const wordRight = currWordElement.getBoundingClientRect().right;
          setCursorPosition({ top: prevLetterTop, left: wordRight });
        }
      }
    }
  }, [currLetterIdx, currWordIdx, isLoading]);

  const handleResize = debounce(() => {
    updateCursorPosition();
  }, 300);

  // Ensures cursor position updates after window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    updateScrollPosition();
  }, [gameWords, wordsClassNames, currWordIdx, updateScrollPosition]);

  useEffect(() => {
    updateScrollPosition();
  }, [currLetterIdx, updateCursorPosition]);

  return (
    <>
      <Cursor top={cursorPosition.top} left={cursorPosition.left} />
      <div className="wordbox" ref={wordBoxRef}>
        {gameWords.map((word, indx) => (
          <Word key={indx} wordIndx={indx} />
        ))}
      </div>
    </>
  );
}

export default WordBox;
