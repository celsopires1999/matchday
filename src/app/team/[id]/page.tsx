import Link from "next/link";

// Dummy data for teams and players (in a real app, you'd fetch this data based on the team ID)
const teams = [
  { id: 101, name: "Team A", players: ["Player 1", "Player 2", "Player 3"] },
  { id: 102, name: "Team B", players: ["Player 4", "Player 5", "Player 6"] },
  { id: 103, name: "Team C", players: ["Player 7", "Player 8", "Player 9"] },
  { id: 104, name: "Team D", players: ["Player 10", "Player 11", "Player 12"] },
  { id: 105, name: "Team E", players: ["Player 13", "Player 14", "Player 15"] },
  { id: 106, name: "Team F", players: ["Player 16", "Player 17", "Player 18"] },
];

export default function TeamPage({ params }: { params: { id: string } }) {
  const teamId = parseInt(params.id);
  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to Games
      </Link>
      <h1 className="text-3xl font-bold mb-4">{team.name} Players</h1>
      <ul className="space-y-2">
        {team.players.map((player, index) => (
          <li key={index} className="bg-white shadow rounded-lg p-4">
            {player}
          </li>
        ))}
      </ul>
    </div>
  );
}
