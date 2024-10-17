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
import { Team } from "@prisma/client";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { addTeam, deleteTeam, updateTeam } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Plus className="h-4 w-4" />
    </Button>
  );
}

export function TeamManagement({ teams }: { teams: Team[] }) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const router = useRouter();
  const addTeamFormRef = useRef<HTMLFormElement>(null);

  const handleAddTeam = async (formData: FormData) => {
    const response = await addTeam(formData);

    if (response.code !== 201) {
      toast.error(response.message);
      return;
    }
    addTeamFormRef.current?.reset();
    toast.success("Team created");
    router.refresh();
  };

  const handleUpdateTeam = async (formData: FormData) => {
    const response = await updateTeam(formData);
    if (response.code !== 200) {
      toast.error(response.message);
      return;
    }

    toast.success("Team updated");
    setEditingTeam(null);
    router.refresh();
  };

  const handleDeleteTeam = async (team: Team) => {
    const formData = new FormData();
    formData.append("teamId", team.teamId);
    const response = await deleteTeam(formData);
    if (response.code !== 200) {
      toast.error(response.message);
      return;
    }

    setIsDeleteDialogOpen(false);
    toast.success("Team deleted");
    router.refresh();
  };

  const openDeleteDialog = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Add New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={addTeamFormRef}
            action={handleAddTeam}
            className="flex gap-2"
          >
            <Input
              type="text"
              name="name"
              placeholder="Enter team name"
              className="flex-grow"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SubmitButton />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Team</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Team List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.map((team) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg"
              >
                <div className="flex-grow">
                  {editingTeam?.teamId === team.teamId ? (
                    <form action={handleUpdateTeam} className="flex gap-2">
                      <Input
                        type="text"
                        name="name"
                        defaultValue={editingTeam.name}
                        className="w-full"
                      />
                      <input type="hidden" name="teamId" value={team.teamId} />
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
                    <span className="text-primary">{team.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingTeam?.teamId !== team.teamId && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setEditingTeam(team)}
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
                          onClick={() => openDeleteDialog(team)}
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
              Are you sure you want to delete {teamToDelete?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => teamToDelete && handleDeleteTeam(teamToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
