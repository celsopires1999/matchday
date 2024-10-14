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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Game #{game?.number}</h1>
        <h1 className="text-lg font-bold">
          {game?.home.gols} x {game?.away.gols}
        </h1>
        <h1 className="text-lg font-bold">
          {game?.date.toLocaleDateString("pt-BR")}
        </h1>
      </div>
      <Tabs defaultValue="home">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="home" className="font-semibold text-lg">
            {game?.home.teamName}
          </TabsTrigger>
          <TabsTrigger value="away" className="font-semibold text-lg">
            {game?.away.teamName}
          </TabsTrigger>
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
