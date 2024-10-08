import Link from "next/link";

// Dummy data for games
const games = [
  { id: 1, homeTeam: "Team A", awayTeam: "Team B", score: "0-0" },
  { id: 2, homeTeam: "Team C", awayTeam: "Team D", score: "1-1" },
  { id: 3, homeTeam: "Team E", awayTeam: "Team F", score: "2-0" },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Games</h1>
      <ul className="space-y-4">
        {games.map((game) => (
          <li key={game.id} className="bg-white shadow rounded-lg p-4">
            <Link
              href={`/game/${game.id}`}
              className="text-blue-600 hover:underline"
            >
              {game.homeTeam} vs {game.awayTeam} ({game.score})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
