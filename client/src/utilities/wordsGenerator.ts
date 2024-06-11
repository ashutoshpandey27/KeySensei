export async function wordsGenerator(
  length: number,
  difficulty: string
): Promise<string[]> {
  if (!length || !difficulty) {
    throw new Error("Invalid length or difficulty");
  }

  try {
    const response = await fetch('../../public/data/wordlist.json');

    if(!response.ok){
        throw new Error("Network response was not om while attempting to fetch wordList.");
    }

    const wordsArray = await response.json();

    const difficultyMapping = new Map([["easy" , 5], ["medium" , 10] , ["hard" ,15]]);

    const difficultyValue = difficultyMapping.get(difficulty);
    const minWordLength = difficultyValue !== undefined ? difficultyValue - 5 : 0;
    const maxWordLength = difficultyValue || 10;

    // filter out words that are not within range of min and max word lengths

    const filteredWordsArray = wordsArray.filter((word: string) => minWordLength <= word.length && word.length <= maxWordLength);

    // ensure the requested length does not exceed the array size
    length = Math.min(length, filteredWordsArray.length);
    let result: string[] = [];
    for(let i = 0 ; i < length ; i++){

            let randomIndx = Math.floor(Math.random() * filteredWordsArray.length);
            result.push(filteredWordsArray[randomIndx]); 
            filteredWordsArray.splice(randomIndx,1);
        }
        return result;
  } catch (err) {
    console.error("Error fetching or processing words:", err);
    throw err; // Re-throw the error to handle it outside of the function 
  }
}
