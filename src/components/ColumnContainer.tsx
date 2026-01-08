import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import type { Column, Task, Id } from "../types";
import TaskCard from "./Taskcard";
import { useMemo } from "react";

interface Props {
  column: Column;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, title: string, content: string) => void;
}

export default function ColumnContainer({ column, tasks, createTask, deleteTask, updateTask }: Props) {
  const tasksIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { setNodeRef } = useSortable({ id: column.id, data: { type: "Column", column } });

  return (
    <div ref={setNodeRef} 
         className="bg-slate-900/50 border border-slate-800 w-[350px] h-[750px] max-h-[750px] 
                    rounded-2xl flex flex-col backdrop-blur-sm">
      
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <h2 className="font-semibold text-slate-100">{column.title}</h2>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-3 p-3 overflow-y-auto scrollbar-hide">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              deleteTask={deleteTask} 
              updateTask={updateTask} 
            />
          ))}
        </SortableContext>
      </div>

      <button 
        onClick={() => createTask(column.id)}
        className="m-3 p-3 flex items-center justify-center gap-2 rounded-xl
                         border border-dashed border-slate-700 text-slate-400
                         hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5
                         transition-all duration-200 text-sm font-medium"
      >
        <span>+</span> Ajouter une carte
      </button>
    </div>
  );
}