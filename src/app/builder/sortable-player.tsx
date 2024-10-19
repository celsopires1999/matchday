import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Player } from "./types";

export function SortablePlayer({ player }: { player: Player }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id, data: { player } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-secondary p-2 rounded-md"
      >
        <div className="font-semibold">{player.name}</div>
        <div className="text-sm text-muted-foreground">{player.position}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-secondary p-2 rounded-md cursor-move"
    >
      <div className="font-semibold">{player.name}</div>
      <div className="text-sm text-muted-foreground">{player.position}</div>
    </div>
  );
}
