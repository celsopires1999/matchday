import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game } from "@prisma/client";
import { getGame } from "./actions";
import { PlayerList } from "./player-list";

export default async function PlayerScore({
  params,
}: {
  params: { gameId: string };
}) {
  const { code, message, data: game } = await getGame(params.gameId);

  if (code !== 200) {
    throw new Error(message);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold mb-8">Game #{game?.number}</h1>
        <h1 className="text-lg font-bold mb-8">
          {game?.home.gols} x {game?.away.gols}
        </h1>
        <h1 className="text-lg font-bold mb-8">
          {game?.date.toLocaleDateString("pt-BR")}
        </h1>
      </div>
      <Tabs defaultValue="home">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">{game?.home.teamName}</TabsTrigger>
          <TabsTrigger value="away">{game?.away.teamName}</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <PlayerList game={game as Game} home={true} />
        </TabsContent>
        <TabsContent value="away">
          <PlayerList game={game as Game} home={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
