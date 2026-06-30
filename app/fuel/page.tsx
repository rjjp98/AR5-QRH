'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Fuel() {
  const [fuelOnBoard, setFuelOnBoard] = useState(5000);
  const [burnRate, setBurnRate] = useState(350);

  const endurance = fuelOnBoard / burnRate;
  const hours = Math.floor(endurance);
  const minutes = Math.round((endurance - hours) * 60);

  return (
    <div className="min-h-screen bg-ops-dark">
      <header className="border-b border-ops-border bg-ops-surface sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ops-secondary hover:text-ops-primary transition-smooth">
            <ChevronLeft size={20} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-petroleum-400">Combustível</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="card-ops mb-6">
          <h2 className="text-lg font-semibold text-petroleum-300 mb-4">Combustível a Bordo</h2>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-petroleum-400 mb-2">{fuelOnBoard}</p>
            <p className="text-ops-secondary">kg</p>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            value={fuelOnBoard}
            onChange={(e) => setFuelOnBoard(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="card-ops mb-6">
          <h2 className="text-lg font-semibold text-petroleum-300 mb-4">Taxa de Consumo</h2>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-petroleum-400 mb-2">{burnRate}</p>
            <p className="text-ops-secondary">kg/h</p>
          </div>
          <input
            type="range"
            min="100"
            max="800"
            value={burnRate}
            onChange={(e) => setBurnRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="card-ops border-2 border-green-600">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Autonomia</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400 mb-2">{hours}h {minutes}m</p>
            <p className="text-ops-secondary">Tempo até reserva</p>
          </div>
        </div>
      </main>
    </div>
  );
}
