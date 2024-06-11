/**
 *calculate the words per minute(wpm)
 *@param lastWordIndx - the indx of the last word the player was on.
 *@param wordsStatuses - An array containing the className of each game word representing each word as correct/incorrect
 *@param startTime - the starting time of the game
 *@returns - the calculated words per minute
 */

export function calculateWPM(
  lastWordIndx: number,
  wordsStatuses: string[],
  startTime: number
): number {
  let correctWords = 0;

  const gameMinutes = startTime / 60;

  for (let wordIndx = 0; wordIndx < lastWordIndx; wordIndx++) {
    if (wordsStatuses[wordIndx] !== "word incorrect") {
      correctWords++;
    }
  }

  const wpm = correctWords / gameMinutes;

  return wpm;
}
