import axios from "axios";
// import {API_BASE_URL} from '../config.ts'

export async function saveScore(userId: string, score: number): Promise<void> {
  const data = {
    userId,
    value: score,
  };

  // don't attempt to save the score if it is null or zero
  if (!score || score === 0) {
    return;
  }

  try {
    const response = await axios.post(`http://localhost:3000/score`, data);
    console.log("Successfully saved score", response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Error saving score", err.response?.data || err.message);
    } else {
      console.error("An unexpected error occurred", err);
    }
    throw err;
  }
}
