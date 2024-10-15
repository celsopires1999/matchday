"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Check } from "lucide-react";

interface Player {
  id: number;
  name: string;
}

export default function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: Date.now(), name: newPlayerName.trim() }]);
      setNewPlayerName("");
    }
  };

  const deletePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const startEditing = (player: Player) => {
    setEditingPlayer(player);
  };

  const updatePlayer = (id: number, newName: string) => {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, name: newName } : player
      )
    );
    setEditingPlayer(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Add New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="flex-grow"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={addPlayer}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Player</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Player List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg"
              >
                <div className="flex-grow">
                  {editingPlayer?.id === player.id ? (
                    <Input
                      type="text"
                      value={editingPlayer.name}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          name: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <span className="text-primary">{player.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {editingPlayer?.id === player.id ? (
                          <Button
                            onClick={() =>
                              updatePlayer(player.id, editingPlayer.name)
                            }
                            size="icon"
                            variant="outline"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => startEditing(player)}
                            size="icon"
                            variant="outline"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {editingPlayer?.id === player.id ? "Save" : "Edit"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => deletePlayer(player.id)}
                          size="icon"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
