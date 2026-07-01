'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import NocChecklist from './components/NocChecklist';

type PageType = 'home' | 'dashboard' | 'checklists' | 'fuel' | 'wind' | 'range';
type ChecklistType = 'noc' | 'pdi';

const NAV_TABS: { id: PageType; label: string }[] = [
  { id: 'home', label: '🏠 Home' },
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'checklists', label: '✓ Checklists' },
  { id: 'fuel', label: '⛽ Fuel' },
  { id: 'wind', label: '💨 Wind' },
  { id: 'range', label: '📡 Range' },
];

const WIND_LIMITS = {
  maxHeadwind: 25,
  maxCrosswind: 14,
  maxTailwind: 5,
  maxCruise: 35,
} as const;

const AR5_LIMITS = [
  { label: 'Max Headwind', value: `${WIND_LIMITS.maxHeadwind} kts (gusts 30)` },
  { label: 'Max Crosswind', value: `${WIND_LIMITS.maxCrosswind} kts (gusts 17)` },
  { label: 'Max Tailwind', value: `${WIND_LIMITS.maxTailwind} kts` },
  { label: 'Max Cruise Wind', value: `${WIND_LIMITS.maxCruise} kts` },
  { label: 'Temp Range', value: '-10 to +40 °C' },
  { label: 'Cruise IAS < 150 kg', value: '2700 cm/s' },
  { label: 'Cruise IAS > 150 kg', value: '2800 cm/s' },
  { label: 'Cruise IAS > 165 kg', value: '2900 cm/s' },
  { label: 'Min Loiter Radius', value: '250 m' },
  { label: 'GPS Sats Required', value: '> 6 per sensor' },
];

function toHHMM(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h ${mm.toString().padStart(2, '0')}m`;
}

/* ────────────────────────────────────────────────
   Fuel & Endurance Calculator
──────────────────────────────────────────────── */
function FuelCalculator() {
  const [fuelLoaded, setFuelLoaded] = useState('60');
  const [consumptionRate, setConsumptionRate] = useState('12');
  const [reserveFuel, setReserveFuel] = useState('5');

  const calc = useMemo(() => {
    const f = parseFloat(fuelLoaded);
    const r = parseFloat(consumptionRate);
    const res = parseFloat(reserveFuel) || 0;
    if (!f || !r || f <= 0 || r <= 0) return null;
    const usable = Math.max(0, f - res);
    return {
      usable: usable.toFixed(1),
      enduranceFull: toHHMM(f / r),
      enduranceToReserve: toHHMM(usable / r),
    };
  }, [fuelLoaded, consumptionRate, reserveFuel]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h3 className="text-xl font-black text-white mb-4">⛽ Fuel &amp; Endurance Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Fuel Loaded (L)</span>
            <input type="number" value={fuelLoaded} min="0" step="1" onChange={e => setFuelLoaded(e.target.value)}
              placeholder="e.g. 60"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Consumption Rate (L/h)</span>
            <input type="number" value={consumptionRate} min="0" step="0.5" onChange={e => setConsumptionRate(e.target.value)}
              placeholder="e.g. 12"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Reserve Fuel (L)</span>
            <input type="number" value={reserveFuel} min="0" step="0.5" onChange={e => setReserveFuel(e.target.value)}
              placeholder="e.g. 5"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
        </div>

        {calc ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700 text-center">
              <p className="text-slate-400 text-xs mb-1">Usable Fuel</p>
              <p className="text-2xl font-black text-white">{calc.usable} L</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-green-800 text-center">
              <p className="text-slate-400 text-xs mb-1">Max Endurance (all fuel)</p>
              <p className="text-2xl font-black text-green-400">{calc.enduranceFull}</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-yellow-800 text-center">
              <p className="text-slate-400 text-xs mb-1">Endurance to Reserve</p>
              <p className="text-2xl font-black text-yellow-400">{calc.enduranceToReserve}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-500 text-sm text-center">Enter fuel and consumption values to calculate endurance.</p>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Wind Component Calculator
──────────────────────────────────────────────── */
function WindCalculator() {
  const [windDir, setWindDir] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [rwHeading, setRwHeading] = useState('');

  const calc = useMemo(() => {
    const wd = parseFloat(windDir);
    const ws = parseFloat(windSpeed);
    const rh = parseFloat(rwHeading);
    if (isNaN(wd) || isNaN(ws) || isNaN(rh) || ws <= 0) return null;
    const angle = ((wd - rh + 360) % 360) * (Math.PI / 180);
    const headwindRaw = ws * Math.cos(angle);
    const crosswindRaw = ws * Math.sin(angle);
    const headwind = headwindRaw >= 0 ? headwindRaw : 0;
    const tailwind = headwindRaw < 0 ? -headwindRaw : 0;
    const crosswind = Math.abs(crosswindRaw);
    const crosswindDir = crosswindRaw >= 0 ? 'from right' : 'from left';
    const cwOk = crosswind <= WIND_LIMITS.maxCrosswind;
    const hwOk = headwind <= WIND_LIMITS.maxHeadwind;
    const twOk = tailwind <= WIND_LIMITS.maxTailwind;
    return { headwind, tailwind, crosswind, crosswindDir, cwOk, hwOk, twOk, allOk: cwOk && hwOk && twOk };
  }, [windDir, windSpeed, rwHeading]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h3 className="text-xl font-black text-white mb-4">💨 Wind Component Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Wind Direction (°)</span>
            <input type="number" value={windDir} min="0" max="360" onChange={e => setWindDir(e.target.value)}
              placeholder="e.g. 270"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Wind Speed (kts)</span>
            <input type="number" value={windSpeed} min="0" step="0.5" onChange={e => setWindSpeed(e.target.value)}
              placeholder="e.g. 15"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Runway Heading (°)</span>
            <input type="number" value={rwHeading} min="0" max="360" onChange={e => setRwHeading(e.target.value)}
              placeholder="e.g. 180"
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
        </div>

        {calc ? (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`bg-slate-900/60 rounded-lg p-4 border text-center ${calc.hwOk ? 'border-slate-700' : 'border-red-500'}`}>
                <p className="text-slate-400 text-xs mb-1">Headwind</p>
                <p className={`text-2xl font-black ${calc.hwOk ? 'text-green-400' : 'text-red-400'}`}>
                  {calc.headwind.toFixed(1)} kts
                </p>
                <p className="text-slate-500 text-xs mt-1">Limit: {WIND_LIMITS.maxHeadwind} kts {calc.hwOk ? '✓' : '⚠'}</p>
              </div>
              <div className={`bg-slate-900/60 rounded-lg p-4 border text-center ${calc.twOk ? 'border-slate-700' : 'border-red-500'}`}>
                <p className="text-slate-400 text-xs mb-1">Tailwind</p>
                <p className={`text-2xl font-black ${calc.tailwind > 0 ? (calc.twOk ? 'text-yellow-400' : 'text-red-400') : 'text-slate-500'}`}>
                  {calc.tailwind.toFixed(1)} kts
                </p>
                <p className="text-slate-500 text-xs mt-1">Limit: {WIND_LIMITS.maxTailwind} kts {calc.twOk ? '✓' : '⚠'}</p>
              </div>
              <div className={`bg-slate-900/60 rounded-lg p-4 border text-center ${calc.cwOk ? 'border-slate-700' : 'border-red-500'}`}>
                <p className="text-slate-400 text-xs mb-1">Crosswind ({calc.crosswindDir})</p>
                <p className={`text-2xl font-black ${calc.cwOk ? 'text-yellow-400' : 'text-red-400'}`}>
                  {calc.crosswind.toFixed(1)} kts
                </p>
                <p className="text-slate-500 text-xs mt-1">Limit: {WIND_LIMITS.maxCrosswind} kts {calc.cwOk ? '✓' : '⚠'}</p>
              </div>
            </div>
            <div className={`rounded-lg p-4 border text-center ${calc.allOk ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
              <p className={`text-lg font-black ${calc.allOk ? 'text-green-400' : 'text-red-400'}`}>
                {calc.allOk ? '✅ WITHIN OPERATING LIMITS' : '⛔ EXCEEDS OPERATING LIMITS'}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-500 text-sm text-center">Enter wind direction, speed and runway heading to calculate components.</p>
        )}

        <div className="mt-4 bg-slate-900/40 rounded p-3 text-xs text-slate-400">
          <span className="font-bold text-slate-300">AR5 MK3 Limits: </span>
          Headwind ≤{WIND_LIMITS.maxHeadwind} kts (gusts 30) · Crosswind ≤{WIND_LIMITS.maxCrosswind} kts (gusts 17) · Tailwind ≤{WIND_LIMITS.maxTailwind} kts · Max Cruise ≤{WIND_LIMITS.maxCruise} kts
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Range & Endurance Calculator
──────────────────────────────────────────────── */
function RangeCalculator() {
  const [fuelLoaded, setFuelLoaded] = useState('60');
  const [consumptionRate, setConsumptionRate] = useState('12');
  const [reserveFuel, setReserveFuel] = useState('5');
  const [cruiseSpeed, setCruiseSpeed] = useState('70');

  const calc = useMemo(() => {
    const f = parseFloat(fuelLoaded);
    const r = parseFloat(consumptionRate);
    const res = parseFloat(reserveFuel) || 0;
    const spd = parseFloat(cruiseSpeed);
    if (!f || !r || !spd || f <= 0 || r <= 0 || spd <= 0) return null;
    const usable = Math.max(0, f - res);
    const enduranceH = usable / r;
    const rangeNm = enduranceH * spd;
    const rangeKm = rangeNm * 1.852;
    return {
      endurance: toHHMM(enduranceH),
      rangeNm: rangeNm.toFixed(0),
      rangeKm: rangeKm.toFixed(0),
    };
  }, [fuelLoaded, consumptionRate, reserveFuel, cruiseSpeed]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h3 className="text-xl font-black text-white mb-4">📡 Range &amp; Endurance Calculator</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Fuel Loaded (L)</span>
            <input type="number" value={fuelLoaded} min="0" step="1" onChange={e => setFuelLoaded(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Consumption (L/h)</span>
            <input type="number" value={consumptionRate} min="0" step="0.5" onChange={e => setConsumptionRate(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Reserve Fuel (L)</span>
            <input type="number" value={reserveFuel} min="0" step="0.5" onChange={e => setReserveFuel(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm block mb-1">Cruise Speed (kts)</span>
            <input type="number" value={cruiseSpeed} min="0" step="1" onChange={e => setCruiseSpeed(e.target.value)}
              className="w-full bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-red-500" />
          </label>
        </div>

        {calc ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 rounded-lg p-4 border border-green-800 text-center">
              <p className="text-slate-400 text-xs mb-1">Endurance (to reserve)</p>
              <p className="text-2xl font-black text-green-400">{calc.endurance}</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-blue-800 text-center">
              <p className="text-slate-400 text-xs mb-1">Range</p>
              <p className="text-2xl font-black text-blue-400">{calc.rangeNm} nm</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-blue-900 text-center">
              <p className="text-slate-400 text-xs mb-1">Range</p>
              <p className="text-2xl font-black text-blue-300">{calc.rangeKm} km</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-500 text-sm text-center">Enter fuel and cruise speed to calculate range.</p>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main App
──────────────────────────────────────────────── */
export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistType>('noc');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ── Header ── */}
      <header className="border-b border-slate-700 backdrop-blur-md sticky top-0 z-40 bg-slate-900/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AR5 MK3 QRH</h1>
              <p className="text-slate-400 text-sm">Quick Reference Handbook</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 font-semibold">Tekever Flight Operations</p>
              <p className="text-slate-500 text-xs">Version 12 | 08-Oct-2024</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Navigation ── */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                  currentPage === tab.id
                    ? 'text-red-500 border-red-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ── HOME ── */}
        {currentPage === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-900/40 to-slate-800 rounded-lg p-6 border border-red-900/50">
              <h2 className="text-2xl font-black text-white mb-1">AR5 MK3 Quick Reference Handbook</h2>
              <p className="text-slate-400 text-sm">Tekever Flight Operations · Version 12 · 08-Oct-2024</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(
                [
                  { icon: '✓', label: 'NOC Checklist', desc: 'Normal Operations Checklist', page: 'checklists' },
                  { icon: '⛽', label: 'Fuel Calculator', desc: 'Endurance & fuel planning', page: 'fuel' },
                  { icon: '💨', label: 'Wind Calculator', desc: 'Head/cross/tailwind components', page: 'wind' },
                  { icon: '📡', label: 'Range & Endurance', desc: 'Range planning calculator', page: 'range' },
                  { icon: '📊', label: 'Dashboard', desc: 'Mission statistics overview', page: 'dashboard' },
                ] as { icon: string; label: string; desc: string; page: PageType }[]
              ).map(card => (
                <button
                  key={card.page}
                  onClick={() => setCurrentPage(card.page)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left hover:border-red-500 hover:bg-slate-700/50 transition-all"
                >
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <div className="text-white font-bold text-sm">{card.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{card.desc}</div>
                </button>
              ))}
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-white font-black text-lg mb-4">⚠️ Key Operational Limits — AR5 MK3</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AR5_LIMITS.map(limit => (
                  <div key={limit.label} className="flex justify-between items-center bg-slate-900/40 rounded px-3 py-2">
                    <span className="text-slate-400 text-xs">{limit.label}</span>
                    <span className="text-white text-xs font-bold">{limit.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-xl font-black mb-4">Monthly Missions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ month: 'Week 1', missions: 12 }, { month: 'Week 2', missions: 15 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="missions" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-xl font-black mb-4">Flight Hours Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[{ name: 'Training', value: 340 }, { name: 'Operations', value: 680 }]}
                    cx="50%" cy="50%" outerRadius={100} dataKey="value"
                  >
                    <Cell fill="#dc2626" />
                    <Cell fill="#2563eb" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── CHECKLISTS ── */}
        {currentPage === 'checklists' && (
          <div className="text-white">
            <div className="flex gap-4 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedChecklist('noc')}
                className={`px-6 py-2 font-bold rounded-lg transition ${
                  selectedChecklist === 'noc' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                NOC — Normal Operations
              </button>
              <button
                onClick={() => setSelectedChecklist('pdi')}
                className={`px-6 py-2 font-bold rounded-lg transition ${
                  selectedChecklist === 'pdi' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                PDI — Pre-Delivery Inspection
              </button>
            </div>
            {selectedChecklist === 'noc' && <NocChecklist />}
            {selectedChecklist === 'pdi' && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="text-5xl mb-4">🔧</div>
                <p className="text-lg font-bold text-slate-400">PDI Checklist</p>
                <p className="text-sm mt-1">Em desenvolvimento — disponível em breve.</p>
              </div>
            )}
          </div>
        )}

        {/* ── FUEL ── */}
        {currentPage === 'fuel' && <FuelCalculator />}

        {/* ── WIND ── */}
        {currentPage === 'wind' && <WindCalculator />}

        {/* ── RANGE ── */}
        {currentPage === 'range' && <RangeCalculator />}
      </main>
    </div>
  );
}
