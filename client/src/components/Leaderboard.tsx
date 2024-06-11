import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useGameContext } from "../context/GameContext";

type LeaderboardProps = {};

type Ranking = [string, number]; // define a tuple for ranking

// Define an interface for the data items
interface DataItem {
  userId: string;
  value: number;
}

function Leaderboard({}: LeaderboardProps) {
  const { gameFinished } = useGameContext();
  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    async function fetchAndSetRankings() {
      try {
        const response = await axios.get('http://localhost:3000/score');
        const dataArray: DataItem[] = response.data.data;

        const rankingArray: Ranking[] = dataArray.map((item: DataItem) => [item.userId, item.value]);

        rankingArray.sort((a, b) => b[1] - a[1]);
        const topTenRankings = rankingArray.slice(0, 10);
        setRankings(topTenRankings);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.error("An unexpected error occurred:" + err);
        }
      }
    }
    fetchAndSetRankings();
  }, [gameFinished]);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking, index) => (
            <tr key={index}>
              <td>{ranking[0]}</td>
              <td>{ranking[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
