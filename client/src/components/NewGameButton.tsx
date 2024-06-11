import React from "react";
import { useGameContext } from "../context/GameContext";

export function NewGameButton() {
    const {fetchWordsAndInitialize} = useGameContext();

    return (
        <>
        <button onClick={fetchWordsAndInitialize}>New Game</button>
        </>
    );
}