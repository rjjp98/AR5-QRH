'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Mission() {
  return (
    <div className="min-h-screen bg-ops-dark">
      <header className="border-b border-ops-border bg-ops-surface sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ops-secondary hover:text-ops-primary transition-smooth">
            <ChevronLeft size={20} />
            <span className="text-sm">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-petroleum-400">Planeamento</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="card-ops text-center py-12">
          <p className="text-ops-secondary">Página em desenvolvimento</p>
          <p className="text-sm text-ops-secondary mt-2">Volte em breve para planeamento de missões</p>
        </div>
      </main>
    </div>
  );
}
