"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { TaskModel } from "./types";
import { Column } from "./column";

function BuilderPage() {
  const [tasks, setTasks] = useState<TaskModel[]>([
    { id: 1, title: "Add tests to homepage" },
    { id: 2, title: "Fix styling in about section" },
    { id: 3, title: "Learn how to center a div" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getTaskPos = (id: number) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id as number);
      const newPos = getTaskPos(over?.id as number);

      return arrayMove(tasks, originalPos, newPos);
    });
  };

  return (
    <div>
      <h1>My Tasks ✅</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Column tasks={tasks} />
      </DndContext>
    </div>
  );
}

export default BuilderPage;
