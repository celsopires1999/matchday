import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { SortablePlayer } from "./sortable-player";
import { Player } from "./types";
import { useDroppable } from "@dnd-kit/core";

export function PlayerList({
  id,
  title,
  players,
}: {
  id: string;
  title: string;
  players: Player[];
}) {
  const playersId = useMemo(
    () => players.map((player) => player?.id),
    [players],
  );
  const { setNodeRef } = useDroppable({
    id: id,
  });
  return (
    <Card className="flex-1" ref={setNodeRef}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext
          id={id}
          items={playersId}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-[200px] space-y-2">
            {players.map((player) => (
              <SortablePlayer key={player?.id} player={player} />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
