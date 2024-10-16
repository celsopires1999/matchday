"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Player } from "@prisma/client";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { addPlayer, deletePlayer, updatePlayer } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Plus className="h-4 w-4" />
    </Button>
  );
}

export function PlayerManagement({ players }: { players: Player[] }) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const router = useRouter();
  const addPlayerFormRef = useRef<HTMLFormElement>(null);

  const handleAddPlayer = async (formData: FormData) => {
    const response = await addPlayer(formData);

    if (response.code !== 201) {
      toast.error(response.message);
      return;
    }
    addPlayerFormRef.current?.reset();
    toast.success("Player created");
    router.refresh();
  };

  const handleUpdatePlayer = async (formData: FormData) => {
    const response = await updatePlayer(formData);
    if (response.code !== 200) {
      toast.error(response.message);
      return;
    }

    toast.success("Player updated");
    setEditingPlayer(null);
    router.refresh();
  };

  const handleDeletePlayer = async (player: Player) => {
    const formData = new FormData();
    formData.append("playerId", player.playerId);
    const response = await deletePlayer(formData);
    if (response.code !== 200) {
      toast.error(response.message);
      return;
    }

    setIsDeleteDialogOpen(false);
    toast.success("Player deleted");
    router.refresh();
  };

  const openDeleteDialog = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Add New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={addPlayerFormRef}
            action={handleAddPlayer}
            className="flex gap-2"
          >
            <Input
              type="text"
              name="name"
              placeholder="Enter player name"
              className="flex-grow"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SubmitButton />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Player</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
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
                key={player.playerId}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg"
              >
                <div className="flex-grow">
                  {editingPlayer?.playerId === player.playerId ? (
                    <form action={handleUpdatePlayer} className="flex gap-2">
                      <Input
                        type="text"
                        name="name"
                        defaultValue={editingPlayer.name}
                        className="w-full"
                      />
                      <input
                        type="hidden"
                        name="playerId"
                        value={player.playerId}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="submit" size="icon" variant="outline">
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </form>
                  ) : (
                    <span className="text-primary">{player.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingPlayer?.playerId !== player.playerId && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setEditingPlayer(player)}
                            size="icon"
                            variant="outline"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => openDeleteDialog(player)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {playerToDelete?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                playerToDelete && handleDeletePlayer(playerToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
