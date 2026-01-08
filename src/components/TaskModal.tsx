import type { Task } from "../types";
import { useState } from "react";

interface Props {
  task?: Task; // Si présent = édition, sinon = création
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export default function TaskModal({ task, isOpen, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title || "");
  const [content, setContent] = useState(task?.content || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Titre</label>
            <input
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom de la tâche..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Détails de la tâche..."
            />
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition">Annuler</button>
          <button 
            onClick={() => { onSave(title, content); onClose(); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );

}
