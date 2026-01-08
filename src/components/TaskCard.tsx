import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { Task, Id } from "../types";
import TaskModal from "./TaskModal";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, title: string, content: string) => void;
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [showModal, setShowModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = 
    useSortable({ 
      id: task.id, 
      data: { type: "Task", task }, 
      disabled: showModal 
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} 
        className="bg-slate-800/50 border-2 border-blue-500/50 h-[120px] min-h-[120px] rounded-xl" />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={() => setShowModal(true)}
        className="bg-slate-800 border border-slate-700 p-4 min-h-[120px] rounded-xl 
                   hover:border-blue-500/50 transition-all duration-200 group relative
                   shadow-lg hover:shadow-blue-500/10 cursor-grab active:cursor-grabbing text-left"
      >
        <h4 className="font-bold text-blue-400 mb-1 truncate">{task.title || "Sans titre"}</h4>
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {task.content || "Aucune description"}
        </p>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 
                     hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      {showModal && (
        <TaskModal 
          isOpen={showModal} 
          task={task} 
          onClose={() => setShowModal(false)} 
          onSave={(title, content) => updateTask(task.id, title, content)} 
        />
      )}
    </>
  );
}