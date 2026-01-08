import { DndContext, closestCorners, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';

const Board = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Tes données

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Logique pour déplacer une carte d'une colonne à une autre
    // On met à jour le 'columnId' de la tâche active
  };

  return (
    <DndContext 
      collisionDetection={closestCorners} 
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 p-4 overflow-x-auto bg-gray-50 min-h-screen">
        {columns.map(col => (
          <Column 
            key={col.id} 
            column={col} 
            tasks={tasks.filter(t => t.columnId === col.id)} 
          />
        ))}
      </div>
    </DndContext>
  );
};