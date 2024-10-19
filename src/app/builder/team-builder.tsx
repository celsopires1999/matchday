"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { PlayerList } from "./player-list";
import { SortablePlayer } from "./sortable-player";
import { Player } from "./types";

const initialPlayers: Player[] = [
  { id: "player-1", name: "John Doe", position: "Forward" },
  { id: "player-2", name: "Jane Smith", position: "Midfielder" },
  { id: "player-3", name: "Mike Johnson", position: "Defender" },
  { id: "player-4", name: "Sarah Williams", position: "Goalkeeper" },
  { id: "player-5", name: "Tom Brown", position: "Forward" },
  { id: "player-6", name: "Emily Davis", position: "Midfielder" },
  { id: "player-7", name: "Inês Pires", position: "Forward" },
  { id: "player-8", name: "Suzane Pires", position: "Midfielder" },
];

const initialTeamPlayers: Player[] = [];

export default function TeamBuilder() {
  const [availablePlayers, setAvailablePlayers] =
    useState<Player[]>(initialPlayers);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>(initialTeamPlayers);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Team Builder</h1>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className="flex gap-4">
          <PlayerList
            id="availablePlayers"
            title="Available Players"
            players={availablePlayers}
          />
          <PlayerList
            id="teamPlayers"
            title="Your Team"
            players={teamPlayers}
          />
        </div>
        <DragOverlay>
          {activePlayer && <SortablePlayer player={activePlayer} />}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    setActivePlayer(event.active.data.current?.player);
  }

  // function handleDragOver(event: DragOverEvent) {
  function handleDragOver() {
    // const { active, over } = event;
    // if (!over) return;
    // if (active.id !== over.id) {
    //   const activeContainer = active.data.current?.sortable.containerId;
    //   const overContainer = over.data.current?.sortable.containerId || over.id;
    //   if (activeContainer === overContainer) {
    //     // Reordering within the same list
    //     if (activeContainer === "availablePlayers") {
    //       setAvailablePlayers((players) =>
    //         arrayMove(
    //           players,
    //           players.findIndex((p) => p.id === active.id),
    //           players.findIndex((p) => p.id === over.id),
    //         ),
    //       );
    //     } else if (activeContainer === "teamPlayers") {
    //       setTeamPlayers((players) =>
    //         arrayMove(
    //           players,
    //           players.findIndex((p) => p.id === active.id),
    //           players.findIndex((p) => p.id === over.id),
    //         ),
    //       );
    //     }
    //   } else {
    //     // Moving between lists
    //     if (
    //       activeContainer === "availablePlayers" &&
    //       overContainer === "teamPlayers"
    //     ) {
    //       const { newFromList, newToList } = movePlayer(
    //         availablePlayers,
    //         teamPlayers,
    //         active.id as string,
    //         over.id as string,
    //       );
    //       setAvailablePlayers(newFromList);
    //       setTeamPlayers(newToList);
    //     } else if (
    //       activeContainer === "teamPlayers" &&
    //       overContainer === "availablePlayers"
    //     ) {
    //       const { newFromList, newToList } = movePlayer(
    //         teamPlayers,
    //         availablePlayers,
    //         active.id as string,
    //         over.id as string,
    //       );
    //       setTeamPlayers(newFromList);
    //       setAvailablePlayers(newToList);
    //     }
    //   }
    // }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const activeContainer = active.data.current?.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;

      if (activeContainer === overContainer) {
        // Reordering within the same list
        if (activeContainer === "availablePlayers") {
          setAvailablePlayers((players) =>
            arrayMove(
              players,
              players.findIndex((p) => p.id === active.id),
              players.findIndex((p) => p.id === over.id),
            ),
          );
        } else if (activeContainer === "teamPlayers") {
          setTeamPlayers((players) =>
            arrayMove(
              players,
              players.findIndex((p) => p.id === active.id),
              players.findIndex((p) => p.id === over.id),
            ),
          );
        }
      } else {
        // Moving between lists
        if (
          activeContainer === "availablePlayers" &&
          overContainer === "teamPlayers"
        ) {
          const { newFromList, newToList } = movePlayer(
            availablePlayers,
            teamPlayers,
            active.id as string,
            over.id as string,
          );

          setAvailablePlayers(newFromList);
          setTeamPlayers(newToList);
        } else if (
          activeContainer === "teamPlayers" &&
          overContainer === "availablePlayers"
        ) {
          const { newFromList, newToList } = movePlayer(
            teamPlayers,
            availablePlayers,
            active.id as string,
            over.id as string,
          );
          setTeamPlayers(newFromList);
          setAvailablePlayers(newToList);
        }
      }
    }
  }
  function movePlayer(
    fromList: Player[],
    toList: Player[],
    activeId: string,
    overId: string | null,
  ) {
    const activeIndex = fromList.findIndex((p) => p.id === activeId);
    const overIndex = overId
      ? toList.findIndex((p) => p.id === overId)
      : toList.length;

    const newFromList = [...fromList];
    const [movedItem] = newFromList.splice(activeIndex, 1);
    const newToList = [...toList];
    newToList.splice(overIndex, 0, movedItem);

    return { newFromList, newToList };
  }
}
