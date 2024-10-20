"use client";

import { SaveChangesButton } from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

type Player = {
  id: string;
  name: string;
};

const receivedPlayers: Player[] = [
  { id: "1", name: "Suzane" },
  { id: "2", name: "Amélia" },
  { id: "3", name: "Larissa" },
  { id: "4", name: "Ronaldo" },
  { id: "5", name: "Mbappé" },
  { id: "6", name: "Haaland" },
  { id: "7", name: "De Bruyne" },
  { id: "8", name: "Salah" },
];

export default function TeamBuilder() {
  const [teamName, setTeamName] = useState("What is your team name?");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(
    sortPlayersByName(receivedPlayers),
  );

  return (
    <>
      <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          {isEditingName ? (
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onBlur={handleNameSave}
              className="text-xl font-bold"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-bold">{teamName}</h1>
          )}
          <Button variant="ghost" size="icon" onClick={handleNameEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between border-b py-2"
            >
              <span>{player.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayerRemove(player)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between space-x-2">
          <Select onValueChange={handlePlayerAdd}>
            <SelectTrigger>
              <SelectValue placeholder="Select a player" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Players</SelectLabel>
                {availablePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNewPlayer}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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

  function handleNameEdit() {
    setIsEditingName(true);
  }

  function handleNameSave() {
    setIsEditingName(false);
  }

  function handlePlayerAdd(newPlayerId: string) {
    const newPlayer = availablePlayers.find((p) => p.id === newPlayerId);
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setAvailablePlayers(
        availablePlayers.filter((p) => p.id !== newPlayer.id),
      );
    }
  }

  function handlePlayerRemove(player: Player) {
    setPlayers(players.filter((p) => p.id !== player.id));
    const playersList = [...availablePlayers, player];
    setAvailablePlayers(sortPlayersByName(playersList));
  }

  function sortPlayersByName(players: Player[]) {
    return players.sort((a, b) => a.name.localeCompare(b.name));
  }

  function handleCreateNewPlayer() {
    console.log("Create new player");
  }

  function handleCancel() {
    console.log("Cancel");
  }

  function handleSave() {
    console.log("Save");
  }
}
