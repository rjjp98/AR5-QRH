'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Dashboard() {
  const [missionActive, setMissionActive] = useState(true);

  return (
    <div className="min-h-screen bg-ops-dark">
      {/* Header */}
      <header className="border-b border-ops-border bg-ops-surface sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ops-secondary hover:text-ops-primary transition-smooth">
            <ChevronLeft size={20} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-petroleum-400">Dashboard</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Mission Status */}
        <div className="card-ops mb-6 border-2 border-petroleum-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-petroleum-300">Status da Missão</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${ missionActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-ops-secondary">{
                missionActive ? 'Ativa' : 'Inativa'
              }</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-ops-surface-alt rounded p-3">
              <p className="text-xs text-ops-secondary mb-1">Aeronave</p>
              <p className="text-lg font-semibold text-petroleum-300">PT-ABC</p>
            </div>
            <div className="bg-ops-surface-alt rounded p-3">
              <p className="text-xs text-ops-secondary mb-1">Tripulação</p>
              <p className="text-lg font-semibold text-petroleum-300">2/2</p>
            </div>
            <div className="bg-ops-surface-alt rounded p-3">
              <p className="text-xs text-ops-secondary mb-1">Duração</p>
              <p className="text-lg font-semibold text-petroleum-300">4h 30m</p>
            </div>
            <div className="bg-ops-surface-alt rounded p-3">
              <p className="text-xs text-ops-secondary mb-1">Combustível</p>
              <p className="text-lg font-semibold text-green-400">85%</p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/checklists" className="card-ops group">
            <h3 className="text-petroleum-300 font-semibold mb-2 group-hover:text-petroleum-200">Checklists Ativas</h3>
            <p className="text-2xl font-bold text-petroleum-400 mb-1">3</p>
            <p className="text-xs text-ops-secondary">Pre-flight • Engine Start • Take-off</p>
          </Link>

          <Link href="/fuel" className="card-ops group">
            <h3 className="text-petroleum-300 font-semibold mb-2 group-hover:text-petroleum-200">Endurance</h3>
            <p className="text-2xl font-bold text-green-400 mb-1">5h 15m</p>
            <p className="text-xs text-ops-secondary">Tempo até Bingo Fuel</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
