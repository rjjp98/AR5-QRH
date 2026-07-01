'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type PageType = 'home' | 'dashboard' | 'checklists' | 'fuel' | 'wind' | 'range';
type ChecklistType = 'noc' | 'pdi';
type NOCSection = 'preflight' | 'prelanding' | 'handover';
type FormValue = string | boolean;

interface FuelEntry {
  date: string;
  quantity: number;
  type: string;
}

interface WindEntry {
  time: string;
  speed: number;
  direction: number;
  gusts: number;
}

interface RangeEntry {
  distance: number;
  battery: number;
  altitude: number;
  time: string;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistType>('noc');
  const [nocSection, setNocSection] = useState<NOCSection>('preflight');
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [fuelLog, setFuelLog] = useState<FuelEntry[]>([
    { date: '2026-07-01', quantity: 120, type: 'Avgas' },
    { date: '2026-06-30', quantity: 115, type: 'Avgas' },
  ]);
  const [windLog, setWindLog] = useState<WindEntry[]>([
    { time: '08:00', speed: 8, direction: 180, gusts: 12 },
    { time: '09:00', speed: 10, direction: 185, gusts: 15 },
    { time: '10:00', speed: 12, direction: 190, gusts: 18 },
  ]);
  const [rangeLog, setRangeLog] = useState<RangeEntry[]>([
    { distance: 0, battery: 100, altitude: 0, time: '00:00' },
    { distance: 5, battery: 95, altitude: 150, time: '00:15' },
    { distance: 12, battery: 88, altitude: 300, time: '00:30' },
    { distance: 20, battery: 80, altitude: 500, time: '00:45' },
  ]);
  const [newFuel, setNewFuel] = useState({ date: '', quantity: 0, type: 'Avgas' });
  const [newWind, setNewWind] = useState({ time: '', speed: 0, direction: 0, gusts: 0 });
  const [newRange, setNewRange] = useState({ distance: 0, battery: 0, altitude: 0, time: '' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (key: string, value: FormValue) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getTextValue = (key: string) => {
    const value = formData[key];
    return typeof value === 'string' ? value : '';
  };

  const getCheckboxValue = (key: string) => {
    const value = formData[key];
    return typeof value === 'boolean' ? value : false;
  };

  const handleAddFuel = () => {
    if (newFuel.date && newFuel.quantity > 0) {
      setFuelLog([...fuelLog, newFuel]);
      setNewFuel({ date: '', quantity: 0, type: 'Avgas' });
    }
  };

  const handleAddWind = () => {
    if (newWind.time && newWind.speed >= 0) {
      setWindLog([...windLog, newWind]);
      setNewWind({ time: '', speed: 0, direction: 0, gusts: 0 });
    }
  };

  const handleAddRange = () => {
    if (newRange.time && newRange.distance >= 0) {
      setRangeLog([...rangeLog, newRange]);
      setNewRange({ distance: 0, battery: 0, altitude: 0, time: '' });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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

      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            <button onClick={() => setCurrentPage('home')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'home' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>🏠 Home</button>
            <button onClick={() => setCurrentPage('dashboard')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'dashboard' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>📊 Dashboard</button>
            <button onClick={() => setCurrentPage('checklists')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'checklists' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>✓ Checklists</button>
            <button onClick={() => setCurrentPage('fuel')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'fuel' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>⛽ Fuel</button>
            <button onClick={() => setCurrentPage('wind')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'wind' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>💨 Wind</button>
            <button onClick={() => setCurrentPage('range')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'range' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>📡 Range</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && <div className="text-white">Home</div>}
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
                  <Pie data={[{ name: 'Training', value: 340 }, { name: 'Operations', value: 680 }]} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                    <Cell fill="#dc2626" />
                    <Cell fill="#2563eb" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {currentPage === 'checklists' && (
          <div className="text-white">
            <div className="flex gap-4 mb-6 flex-wrap">
              <button onClick={() => setSelectedChecklist('noc')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'noc' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>NOC - Normal Operations</button>
              <button onClick={() => setSelectedChecklist('pdi')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'pdi' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>PDI - Pre-Delivery Inspection</button>
            </div>
            {selectedChecklist === 'noc' && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="flex border-b border-slate-700 bg-slate-700/50">
                  <button onClick={() => setNocSection('preflight')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'preflight' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>Pre-Flight</button>
                  <button onClick={() => setNocSection('prelanding')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'prelanding' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>Pre-Landing</button>
                  <button onClick={() => setNocSection('handover')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'handover' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>Pilot Handover</button>
                </div>
                <div className="p-6">
                  <input type="text" value={getTextValue('aircraftID')} onChange={(e) => handleInputChange('aircraftID', e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm" />
                  <input type="checkbox" checked={getCheckboxValue('noc-0')} onChange={(e) => handleInputChange('noc-0', e.target.checked)} className="ml-4 w-4 h-4 accent-red-500" />
                </div>
              </div>
            )}
          </div>
        )}
        {currentPage === 'fuel' && <div className="text-white">Fuel</div>}
        {currentPage === 'wind' && <div className="text-white">Wind {windLog.length}</div>}
        {currentPage === 'range' && <div className="text-white">Range {rangeLog.length}</div>}
      </main>
    </div>
  );
}
