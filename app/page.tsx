'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('checklists');

  const tabs = [
    { id: 'checklists', label: 'CHECKLISTS' },
    { id: 'emergencies', label: 'EMERGENCIES' },
    { id: 'fuel', label: 'FUEL' },
    { id: 'range', label: 'RANGE' },
    { id: 'wind', label: 'WIND' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27]">
      {/* Header with Navigation Tabs */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-8">
          {/* Tekever Logo */}
          <div className="flex-shrink-0">
            <svg width="120" height="35" viewBox="0 0 140 40" className="fill-red-500">
              <text x="0" y="32" fontSize="28" fontWeight="bold" letterSpacing="2">TEKEVER</text>
            </svg>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-6 md:gap-8 justify-center flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold text-sm tracking-wider transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white border-cyan-400 opacity-100'
                    : 'text-slate-400 border-transparent opacity-30 hover:opacity-60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Menu Toggle */}
          <button className="md:hidden text-white flex-shrink-0">
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section with AR5 */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-red-500/10 opacity-30 pointer-events-none" />
        
        {/* AR5 SVG */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-6">
          <svg width="500" height="350" viewBox="0 0 400 300" className="drop-shadow-2xl">
            {/* Fuselage */}
            <ellipse cx="200" cy="150" rx="80" ry="50" fill="white" opacity="0.95" />
            
            {/* Nose cone */}
            <path d="M 280 150 Q 320 140 350 150 Q 320 160 280 150" fill="white" opacity="0.95" />
            
            {/* Wings */}
            <rect x="80" y="120" width="240" height="20" fill="white" opacity="0.9" rx="10" />
            
            {/* Left wing tip */}
            <rect x="50" y="125" width="40" height="10" fill="white" opacity="0.8" rx="5" />
            
            {/* Right wing tip */}
            <rect x="310" y="125" width="40" height="10" fill="white" opacity="0.8" rx="5" />
            
            {/* Tail wings */}
            <path d="M 140 200 L 120 230 L 140 220 Z" fill="white" opacity="0.85" />
            <path d="M 260 200 L 280 230 L 260 220 Z" fill="white" opacity="0.85" />
            
            {/* Vertical stabilizer */}
            <rect x="190" y="200" width="20" height="60" fill="white" opacity="0.8" rx="5" />
            
            {/* Red accent stripe */}
            <line x1="200" y1="130" x2="200" y2="180" stroke="#ef4444" strokeWidth="3" />
            
            {/* Cyan accent lights */}
            <circle cx="150" cy="140" r="4" fill="#06b6d4" opacity="0.8" />
            <circle cx="250" cy="140" r="4" fill="#06b6d4" opacity="0.8" />
            <circle cx="200" cy="100" r="3" fill="#ef4444" opacity="0.9" />
            
            {/* Landing gear */}
            <line x1="180" y1="200" x2="180" y2="240" stroke="white" strokeWidth="2" opacity="0.7" />
            <line x1="220" y1="200" x2="220" y2="240" stroke="white" strokeWidth="2" opacity="0.7" />
            <circle cx="180" cy="245" r="6" fill="white" opacity="0.6" />
            <circle cx="220" cy="245" r="6" fill="white" opacity="0.6" />
          </svg>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-3 tracking-wider">
              AR5
            </h1>
            <p className="text-cyan-400 text-lg md:text-2xl font-light tracking-widest">
              FLIGHT OPERATIONS COMMANDER
            </p>
            <p className="text-slate-400 text-sm mt-3">v1.0</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {activeTab === 'checklists' && (
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 tracking-wide">CHECKLISTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur border border-cyan-400/20 rounded-lg p-8 hover:border-cyan-400/50 transition">
                <h3 className="text-cyan-400 font-semibold mb-4 text-lg">PRE-FLIGHT</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Battery Status</li>
                  <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> GPS Lock</li>
                  <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Sensor Calibration</li>
                  <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Propellers Check</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur border border-red-500/20 rounded-lg p-8 hover:border-red-500/50 transition">
                <h3 className="text-red-400 font-semibold mb-4 text-lg">ENGINE START</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-3"><span className="text-red-400">✓</span> Motors Online</li>
                  <li className="flex items-center gap-3"><span className="text-red-400">✓</span> Thrust Test</li>
                  <li className="flex items-center gap-3"><span className="text-red-400">✓</span> Vibration Check</li>
                  <li className="flex items-center gap-3"><span className="text-red-400">✓</span> Flight Ready</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 tracking-wide text-red-500">EMERGENCIES</h2>
            <div className="bg-white/5 backdrop-blur border border-red-500/20 rounded-lg p-8">
              <p className="text-slate-300 text-lg">Emergency procedures coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'fuel' && (
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 tracking-wide">FUEL</h2>
            <div className="bg-white/5 backdrop-blur border border-cyan-400/20 rounded-lg p-8">
              <p className="text-slate-300 text-lg">Fuel management system coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'range' && (
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 tracking-wide">RANGE</h2>
            <div className="bg-white/5 backdrop-blur border border-cyan-400/20 rounded-lg p-8">
              <p className="text-slate-300 text-lg">Range calculation system coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'wind' && (
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 tracking-wide">WIND</h2>
            <div className="bg-white/5 backdrop-blur border border-cyan-400/20 rounded-lg p-8">
              <p className="text-slate-300 text-lg">Wind data analysis coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>AR5-QRH © 2026 | Tekever Flight Operations</p>
      </footer>
    </div>
  );
}
