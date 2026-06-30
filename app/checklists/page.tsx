'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Circle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
}

export default function Checklists() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([
    { id: '1', name: 'Verificar combustível', completed: true },
    { id: '2', name: 'Sistema hidráulico OK', completed: true },
    { id: '3', name: 'Instrumentos calibrados', completed: false },
    { id: '4', name: 'Comunicações testadas', completed: false },
  ]);

  const toggleItem = (id: string) => {
    setChecklists(checklists.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completed = checklists.filter(item => item.completed).length;
  const total = checklists.length;

  return (
    <div className="min-h-screen bg-ops-dark">
      <header className="border-b border-ops-border bg-ops-surface sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ops-secondary hover:text-ops-primary transition-smooth">
            <ChevronLeft size={20} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-petroleum-400">Checklists</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="card-ops mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-petroleum-300">Pre-flight Check</h2>
            <span className="text-sm text-ops-secondary">{completed}/{total}</span>
          </div>
          <div className="w-full bg-ops-surface-alt rounded-full h-2">
            <div
              className="bg-petroleum-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {checklists.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="card-ops w-full text-left flex items-center gap-3 hover:border-petroleum-500"
            >
              {item.completed ? (
                <Check className="text-green-500 flex-shrink-0" size={24} />
              ) : (
                <Circle className="text-ops-secondary flex-shrink-0" size={24} />
              )}
              <span className={item.completed ? 'text-ops-secondary line-through' : 'text-ops-primary'}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
