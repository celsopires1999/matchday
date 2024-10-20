"use client";

import { SaveChangesButton } from "@/components/SaveChangesButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game, TeamPlayer } from "@prisma/client";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateGame } from "./actions";

type Props = {
  game?: Game;
  home: boolean;
};
export function PlayerList({ game, home }: Props) {
  const router = useRouter();

  const initialTeamPlayers = home ? game?.home.players : game?.away.players;
  const [players, setPlayers] = useState<TeamPlayer[]>(
    initialTeamPlayers || [],
  );

  const updateStat = (
    id: string,
    stat: "gols" | "assists",
    increment: boolean,
  ) => {
    setPlayers(
      players.map((player) =>
        player.playerId === id
          ? {
              ...player,
              [stat]: Math.max(0, player[stat] + (increment ? 1 : -1)),
            }
          : player,
      ),
    );
  };

  const handleSave = async () => {
    if (!game) {
      return;
    }

    let data: Game;

    if (home) {
      data = {
        ...game,
        home: {
          ...game.home,
          players: players,
        },
      };
    } else {
      data = {
        ...game,
        away: {
          ...game.away,
          players: players,
        },
      };
    }

    const response = await updateGame(data);

    if (response.code !== 200) {
      toast.error(response.message);
      return;
    }

    toast.success("Game updated");
  };

  const handleCancel = () => {
    // In a real application, you might want to confirm before discarding changes
    if (confirm("Are you sure you want to discard changes?")) {
      // Navigate to the dashboard
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="space-y-4">
        {players.map((player) => (
          <Card key={player.playerId}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage alt={player.playerName} />
                  <AvatarFallback>
                    {player.playerName.split(" ").length === 1
                      ? player.playerName.slice(0, 2).toUpperCase()
                      : player.playerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{player.playerName}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Goals: {player.gols}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateStat(player.playerId, "gols", true)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase goals</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateStat(player.playerId, "gols", false)}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease goals</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Assists: {player.assists}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateStat(player.playerId, "assists", true)
                      }
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase assists</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateStat(player.playerId, "assists", false)
                      }
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease assists</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-32" />
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <form action={handleSave}>
            <SaveChangesButton />
          </form>
        </div>
      </div>
    </>
  );
}
