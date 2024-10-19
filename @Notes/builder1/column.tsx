import { Card, CardContent } from "@/components/ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "./task";
import { TaskModel } from "./types";

type Props = {
  tasks: TaskModel[];
};

export function Column({ tasks }: Props) {
  return (
    <Card className="flex-1">
      <CardContent>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className="min-h-[200px] space-y-2">
            {tasks.map((task) => (
              <Task key={task.id} id={task.id} title={task.title} />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
