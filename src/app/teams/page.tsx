"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Check } from "lucide-react";

interface Team {
  id: number;
  name: string;
}

export default function PlayerManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const addTeam = () => {
    if (newTeamName.trim()) {
      setTeams([...teams, { id: Date.now(), name: newTeamName.trim() }]);
      setNewTeamName("");
    }
  };

  const deleteTeam = (id: number) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  const startEditing = (team: Team) => {
    setEditingTeam(team);
  };

  const updateTeam = (id: number, newName: string) => {
    setTeams(
      teams.map((team) => (team.id === id ? { ...team, name: newName } : team))
    );
    setEditingTeam(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>

      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardContent className="space-y-6 mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Add New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="flex-grow"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={addTeam}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Team</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Team List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        {editingTeam?.id === player.id ? (
                          <Input
                            type="text"
                            value={editingTeam.name}
                            onChange={(e) =>
                              setEditingTeam({
                                ...editingTeam,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          player.name
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {editingTeam?.id === player.id ? (
                                <Button
                                  onClick={() =>
                                    updateTeam(player.id, editingTeam.name)
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
                                {editingTeam?.id === player.id
                                  ? "Save"
                                  : "Edit"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => deleteTeam(player.id)}
                                size="icon"
                                className="ml-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
