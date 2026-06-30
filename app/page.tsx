'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed');
      });
    }
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-ops-dark via-ops-surface to-ops-dark px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-ops-primary mb-2 tracking-tight">
            FlightOps
          </h1>
          <p className="text-lg text-ops-secondary">Commander</p>
        </div>

        <p className="text-ops-secondary text-lg mb-12 leading-relaxed">
          Plataforma profissional de operações aéreas. Inicialização da v0.1.0
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/dashboard"
            className="card-ops group hover:border-petroleum-500"
          >
            <div className="text-left">
              <h3 className="text-petroleum-400 font-semibold mb-2 group-hover:text-petroleum-300">
                Dashboard
              </h3>
              <p className="text-sm text-ops-secondary">
                Visão geral da missão e status em tempo real
              </p>
            </div>
          </Link>

          <Link
            href="/checklists"
            className="card-ops group hover:border-petroleum-500"
          >
            <div className="text-left">
              <h3 className="text-petroleum-400 font-semibold mb-2 group-hover:text-petroleum-300">
                Checklists
              </h3>
              <p className="text-sm text-ops-secondary">
                Procedimentos e verificações estruturadas
              </p>
            </div>
          </Link>

          <Link
            href="/fuel"
            className="card-ops group hover:border-petroleum-500"
          >
            <div className="text-left">
              <h3 className="text-petroleum-400 font-semibold mb-2 group-hover:text-petroleum-300">
                Combustível
              </h3>
              <p className="text-sm text-ops-secondary">
                Cálculos de consumo e autonomia
              </p>
            </div>
          </Link>

          <Link
            href="/mission"
            className="card-ops group hover:border-petroleum-500"
          >
            <div className="text-left">
              <h3 className="text-petroleum-400 font-semibold mb-2 group-hover:text-petroleum-300">
                Planeamento
              </h3>
              <p className="text-sm text-ops-secondary">
                Planeamento e briefing de missão
              </p>
            </div>
          </Link>
        </div>

        <div className="text-xs text-ops-secondary border-t border-ops-border pt-6 mt-8">
          <p>v0.1.0 • Modo Desenvolvimento • Sem Conexão Disponível</p>
        </div>
      </div>
    </main>
  );
}
