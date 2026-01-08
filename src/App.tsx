import { useState, useEffect } from 'react';
import type { DragOverEvent } from '@dnd-kit/core';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Column, Task, Id } from './types';
import ColumnContainer from './components/ColumnContainer';
import TaskModal from './components/TaskModal';

const defaultCols: Column[] = [
  { id: "todo", title: "À Faire" },
  { id: "doing", title: "En cours" },
  { id: "done", title: "Terminé" },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("taskflow-tasks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<Id | null>(null);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  function openCreateModal(columnId: Id) {
    setActiveColumnId(columnId);
    setModalOpen(true);
  }

  function handleCreateTask(title: string, content: string) {
    if (!activeColumnId) return;
    const newTask: Task = {
      id: Math.floor(Math.random() * 10001),
      columnId: activeColumnId,
      title: title || "Sans titre",
      content: content,
    };
    setTasks([...tasks, newTask]);
    setActiveColumnId(null);
  }

  function deleteTask(id: Id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function updateTask(id: Id, title: string, content: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title, content } : t)));
  }

  return (
    <div className="min-h-screen w-full flex items-center overflow-x-auto bg-[#0d1117] p-10">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={onDragOver}>
        <div className="m-auto flex gap-6">
          {defaultCols.map((col) => (
            <ColumnContainer 
              key={col.id} 
              column={col} 
              tasks={tasks.filter((t) => t.columnId === col.id)}
              createTask={() => openCreateModal(col.id)}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </div>
      </DndContext>

      {modalOpen && (
        <TaskModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSave={handleCreateTask} 
        />
      )}
    </div>
  );

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default App;