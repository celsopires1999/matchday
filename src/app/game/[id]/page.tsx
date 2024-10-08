"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

// Dummy data for games (in a real app, you'd fetch this data based on the game ID)
const games = [
  {
    id: 1,
    homeTeam: "Team A",
    awayTeam: "Team B",
    score: "0-0",
    homeTeamId: 101,
    awayTeamId: 102,
  },
  {
    id: 2,
    homeTeam: "Team C",
    awayTeam: "Team D",
    score: "1-1",
    homeTeamId: 103,
    awayTeamId: 104,
  },
  {
    id: 3,
    homeTeam: "Team E",
    awayTeam: "Team F",
    score: "2-0",
    homeTeamId: 105,
    awayTeamId: 106,
  },
];

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const gameId = parseInt(params.id);
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return <div>Game not found</div>;
  }

  const handleTeamClick = (teamId: number) => {
    router.push(`/team/${teamId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to Games
      </Link>
      <h1 className="text-3xl font-bold mb-4">
        {game.homeTeam} vs {game.awayTeam}
      </h1>
      <p className="text-xl mb-4">Score: {game.score}</p>
      <div className="space-y-4">
        <button
          onClick={() => handleTeamClick(game.homeTeamId)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View {game.homeTeam} Players
        </button>
        <button
          onClick={() => handleTeamClick(game.awayTeamId)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
        >
          View {game.awayTeam} Players
        </button>
      </div>
    </div>
  );
}
