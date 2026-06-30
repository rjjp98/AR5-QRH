'use client';

import { useState } from 'react';
import Image from 'next/image';

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

  const handleTabChange = (tabId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Aggressive dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#000000]" />
      
      {/* Header with Navigation Tabs */}
      <header className="relative z-40 border-b border-red-600/20 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between gap-8">
          {/* Tekever Logo */}
          <div className="flex-shrink-0">
            <svg width="120" height="35" viewBox="0 0 140 40" className="fill-red-600">
              <text x="0" y="32" fontSize="28" fontWeight="bold" letterSpacing="2">TEKEVER</text>
            </svg>
          </div>

          {/* Navigation Tabs - Aggressive styling */}
          <nav className="flex flex-wrap gap-8 md:gap-12 justify-center flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`font-bold text-sm tracking-wider transition-all duration-200 uppercase whitespace-nowrap border-b-2 pb-1 ${
                  activeTab === tab.id
                    ? 'text-red-600 border-red-600'
                    : 'text-white border-transparent hover:text-red-600 hover:border-red-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Menu Toggle */}
          <button className="md:hidden text-red-600 flex-shrink-0">
            <svg width="28" height="28" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section with AR5 Image */}
      <div className="relative z-30 min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* AR5 Image with fade animation */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(255,255,255,0.1);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgba(239,68,68,0.05);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' width='1200' height='800'/%3E%3C/svg%3E"
            alt="AR5 Background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          
          {/* AR5 SVG - Professional and Aggressive */}
          <svg
            width="700"
            height="500"
            viewBox="0 0 1000 700"
            className="relative z-10 drop-shadow-2xl filter brightness-110 contrast-125"
          >
            {/* Main fuselage - sleek and aggressive */}
            <defs>
              <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.98" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="50%" stopColor="white" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
              </linearGradient>
            </defs>

            {/* Main body - sleek fuselage */}
            <ellipse cx="500" cy="350" rx="200" ry="120" fill="url(#fuselageGrad)" />

            {/* Aggressive nose cone */}
            <path
              d="M 700 350 Q 850 330 950 350 Q 850 370 700 350"
              fill="white"
              opacity="0.96"
            />

            {/* Main wings - extended and aggressive */}
            <rect x="200" y="300" width="600" height="60" fill="url(#wingGrad)" rx="20" />

            {/* Wing tips - aggresive angles */}
            <polygon
              points="150,320 80,310 100,360"
              fill="rgba(255,255,255,0.9)"
            />
            <polygon
              points="850,320 920,310 900,360"
              fill="rgba(255,255,255,0.9)"
            />

            {/* Tail wings - V-shaped */}
            <polygon
              points="350,500 280,620 350,550"
              fill="rgba(255,255,255,0.92)"
            />
            <polygon
              points="650,500 720,620 650,550"
              fill="rgba(255,255,255,0.92)"
            />

            {/* Vertical stabilizer - prominent */}
            <rect x="470" y="500" width="60" height="180" fill="rgba(255,255,255,0.9)" rx="8" />

            {/* Aggressive red stripe down center */}
            <line
              x1="500"
              y1="280"
              x2="500"
              y2="480"
              stroke="#ef4444"
              strokeWidth="8"
              opacity="0.95"
            />

            {/* Cyan accent lights - strategic */}
            <circle cx="350" cy="320" r="8" fill="#06b6d4" opacity="0.9" />
            <circle cx="650" cy="320" r="8" fill="#06b6d4" opacity="0.9" />
            <circle cx="500" cy="250" r="6" fill="#ef4444" opacity="1" />
            <circle cx="480" cy="380" r="5" fill="#06b6d4" opacity="0.8" />
            <circle cx="520" cy="380" r="5" fill="#06b6d4" opacity="0.8" />

            {/* Landing gear - detailed */}
            <line
              x1="420"
              y1="480"
              x2="420"
              y2="600"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="5"
            />
            <line
              x1="580"
              y1="480"
              x2="580"
              y2="600"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="5"
            />
            <circle cx="420" cy="610" r="12" fill="rgba(255,255,255,0.8)" />
            <circle cx="580" cy="610" r="12" fill="rgba(255,255,255,0.8)" />

            {/* Propeller indicators - aggressive detail */}
            <line
              x1="280"
              y1="340"
              x2="240"
              y2="340"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="3"
            />
            <line
              x1="720"
              y1="340"
              x2="760"
              y2="340"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="3"
            />

            {/* Sensor pods - aggressive styling */}
            <rect x="480" y="460" width="40" height="30" fill="#06b6d4" rx="4" opacity="0.8" />
          </svg>
        </div>

        {/* Title - appears after fade */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-widest">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <div className="h-1 w-32 bg-red-600"></div>
        </div>
      </div>

      {/* Content Area - Smooth transition */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div
          className={`transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {activeTab === 'checklists' && (
            <div className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                  <h3 className="text-cyan-400 font-black mb-6 text-2xl tracking-wider">
                    PRE-FLIGHT
                  </h3>
                  <ul className="space-y-4 text-slate-200">
                    <li className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold text-lg">✓</span>
                      <span>Battery Status</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold text-lg">✓</span>
                      <span>GPS Lock</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold text-lg">✓</span>
                      <span>Sensor Calibration</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold text-lg">✓</span>
                      <span>Propellers Check</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-red-600/10 to-red-600/5 backdrop-blur-xl border border-red-600/30 rounded-xl p-8 hover:border-red-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
                  <h3 className="text-red-400 font-black mb-6 text-2xl tracking-wider">
                    ENGINE START
                  </h3>
                  <ul className="space-y-4 text-slate-200">
                    <li className="flex items-center gap-4">
                      <span className="text-red-400 font-bold text-lg">✓</span>
                      <span>Motors Online</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-red-400 font-bold text-lg">✓</span>
                      <span>Thrust Test</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-red-400 font-bold text-lg">✓</span>
                      <span>Vibration Check</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-red-400 font-bold text-lg">✓</span>
                      <span>Flight Ready</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergencies' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-red-600/10 to-red-600/5 backdrop-blur-xl border border-red-600/40 rounded-xl p-12">
                <h2 className="text-4xl font-black mb-6 text-red-400 tracking-wider">
                  EMERGENCY PROCEDURES
                </h2>
                <p className="text-slate-200 text-lg">Emergency systems coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'fuel' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-600/40 rounded-xl p-12">
                <h2 className="text-4xl font-black mb-6 text-cyan-400 tracking-wider">
                  FUEL MANAGEMENT
                </h2>
                <p className="text-slate-200 text-lg">Fuel system analysis coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'range' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-600/40 rounded-xl p-12">
                <h2 className="text-4xl font-black mb-6 text-cyan-400 tracking-wider">
                  RANGE CALCULATION
                </h2>
                <p className="text-slate-200 text-lg">Range analysis coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'wind' && (
            <div className="text-white">
              <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-600/40 rounded-xl p-12">
                <h2 className="text-4xl font-black mb-6 text-cyan-400 tracking-wider">
                  WIND CONDITIONS
                </h2>
                <p className="text-slate-200 text-lg">Wind analysis coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-red-600/20 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations</p>
      </footer>
    </div>
  );
}
