'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('checklists');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabs = [
    { id: 'checklists', label: 'CHECKLISTS' },
    { id: 'emergencies', label: 'EMERGENCIES' },
    { id: 'fuel', label: 'FUEL' },
    { id: 'range', label: 'RANGE' },
    { id: 'wind', label: 'WIND' },
  ];

  const handleTabChange = (tabId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Professional Background with AR5 Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%230a0a0a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3C/linearGradient%3E%3Crect fill='url(%23grad)' width='1200' height='800'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-5" />

      {/* Aggressive shadow overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/40 z-5" />

      {/* Dynamic glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header */}
      <header className="relative z-40 border-b border-red-600/10 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Tekever Logo */}
          <div className="flex-shrink-0">
            <svg width="140" height="40" viewBox="0 0 140 40" className="fill-red-600 drop-shadow-lg">
              <text x="0" y="32" fontSize="28" fontWeight="bold" letterSpacing="2">
                TEKEVER
              </text>
            </svg>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-8 md:gap-12 justify-center flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`font-black text-xs tracking-widest transition-all duration-300 uppercase whitespace-nowrap border-b-2 pb-2 ${
                  activeTab === tab.id
                    ? 'text-red-500 border-red-500 shadow-lg shadow-red-500/50'
                    : 'text-slate-400 border-transparent hover:text-red-400 hover:border-red-600/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-20 min-h-[600px] flex items-center justify-center overflow-hidden py-20">
        {/* Fade transition for content */}
        <div
          className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center">
            <div className="mb-12">
              <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                AR5 MK3
              </h1>
              <p className="text-2xl text-red-500 font-bold tracking-widest mb-8 drop-shadow-lg">
                QUICK REFERENCE HANDBOOK
              </p>
              <div className="flex gap-2 justify-center mb-8">
                <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-transparent drop-shadow-lg"></div>
                <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent drop-shadow-lg"></div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-lg shadow-2xl">
                <span className="text-cyan-400 font-bold">● ONLINE</span>
              </div>
              <div className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-red-600/20 rounded-lg shadow-2xl">
                <span className="text-red-400 font-bold">v1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative title during transition */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-6xl md:text-8xl font-black text-red-500 tracking-widest drop-shadow-2xl">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div
          className={`transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {activeTab === 'checklists' && (
            <div className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PRE-FLIGHT Card */}
                <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                    <h3 className="text-2xl font-black tracking-wider text-cyan-400">PRE-FLIGHT</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition">
                      <span className="text-cyan-400 font-bold">▸</span>
                      <span>Battery Status</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition">
                      <span className="text-cyan-400 font-bold">▸</span>
                      <span>GPS Lock</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition">
                      <span className="text-cyan-400 font-bold">▸</span>
                      <span>Sensor Calibration</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition">
                      <span className="text-cyan-400 font-bold">▸</span>
                      <span>Propellers Check</span>
                    </li>
                  </ul>
                </div>

                {/* ENGINE START Card */}
                <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/20 rounded-2xl p-10 hover:border-red-600/50 transition-all duration-300 shadow-2xl hover:shadow-red-600/30">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-red-600"></div>
                    <h3 className="text-2xl font-black tracking-wider text-red-400">ENGINE START</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-slate-200 hover:text-red-300 transition">
                      <span className="text-red-400 font-bold">▸</span>
                      <span>Motors Online</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-red-300 transition">
                      <span className="text-red-400 font-bold">▸</span>
                      <span>Thrust Test</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-red-300 transition">
                      <span className="text-red-400 font-bold">▸</span>
                      <span>Vibration Check</span>
                    </li>
                    <li className="flex items-center gap-4 text-slate-200 hover:text-red-300 transition">
                      <span className="text-red-400 font-bold">▸</span>
                      <span>Flight Ready</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergencies' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-2xl p-12 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-red-500"></div>
                  <h2 className="text-4xl font-black text-red-400 tracking-wider">EMERGENCY PROCEDURES</h2>
                </div>
                <p className="text-slate-300 text-lg">Emergency systems coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'fuel' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-2xl p-12 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-cyan-500"></div>
                  <h2 className="text-4xl font-black text-cyan-400 tracking-wider">FUEL MANAGEMENT</h2>
                </div>
                <p className="text-slate-300 text-lg">Fuel system analysis coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'range' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-2xl p-12 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-cyan-500"></div>
                  <h2 className="text-4xl font-black text-cyan-400 tracking-wider">RANGE CALCULATION</h2>
                </div>
                <p className="text-slate-300 text-lg">Range analysis coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'wind' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-2xl p-12 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-cyan-500"></div>
                  <h2 className="text-4xl font-black text-cyan-400 tracking-wider">WIND CONDITIONS</h2>
                </div>
                <p className="text-slate-300 text-lg">Wind analysis coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-red-600/10 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations</p>
      </footer>
    </div>
  );
}
