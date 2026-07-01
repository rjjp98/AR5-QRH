'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
            <button onClick={() => setCurrentPage('home')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'home' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              🏠 Home
            </button>
            <button onClick={() => setCurrentPage('dashboard')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'dashboard' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              📊 Dashboard
            </button>
            <button onClick={() => setCurrentPage('checklists')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'checklists' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              ✓ Checklists
            </button>
            <button onClick={() => setCurrentPage('fuel')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'fuel' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              ⛽ Fuel
            </button>
            <button onClick={() => setCurrentPage('wind')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'wind' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              💨 Wind
            </button>
            <button onClick={() => setCurrentPage('range')} className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${currentPage === 'range' ? 'text-red-500 border-red-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
              📡 Range
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-8 text-white shadow-lg">
                <h2 className="text-4xl font-black mb-4">AR5 MK3</h2>
                <p className="text-lg mb-6">Advanced Remotely Piloted Aircraft</p>
                <div className="space-y-3 text-sm">
                  <p>✈️ <span className="font-bold">Max Speed:</span> 130 km/h</p>
                  <p>⏱️ <span className="font-bold">Endurance:</span> 12+ hours</p>
                  <p>🎯 <span className="font-bold">Range:</span> 150+ km</p>
                  <p>📦 <span className="font-bold">Payload:</span> Multi-sensor</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-8 text-white shadow-lg">
                <h3 className="text-2xl font-black mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Aircraft Status:</span><span className="text-green-400 font-bold">🟢 Ready</span></div>
                  <div className="flex justify-between"><span>Last Mission:</span><span className="text-slate-300">2026-07-01 14:30</span></div>
                  <div className="flex justify-between"><span>Total Flights:</span><span className="text-slate-300">247</span></div>
                  <div className="flex justify-between"><span>Flight Hours:</span><span className="text-slate-300">1,240h</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg"><p className="text-sm opacity-80">Total Missions</p><p className="text-4xl font-black">247</p><p className="text-xs text-blue-200 mt-2">+5 this month</p></div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg"><p className="text-sm opacity-80">Flight Hours</p><p className="text-4xl font-black">1,240h</p><p className="text-xs text-green-200 mt-2">+45h this month</p></div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white shadow-lg"><p className="text-sm opacity-80">Avg Endurance</p><p className="text-4xl font-black">11.2h</p><p className="text-xs text-yellow-200 mt-2">Last 10 flights</p></div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white shadow-lg"><p className="text-sm opacity-80">Aircraft Health</p><p className="text-4xl font-black">98%</p><p className="text-xs text-red-200 mt-2">🟢 Ready</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
                <h3 className="text-xl font-black mb-4">Monthly Missions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{ month: 'Week 1', missions: 12 }, { month: 'Week 2', missions: 15 }, { month: 'Week 3', missions: 10 }, { month: 'Week 4', missions: 13 }]}>
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
                    <Pie data={[{ name: 'Training', value: 340 }, { name: 'Operations', value: 680 }, { name: 'Maintenance', value: 220 }]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}h`} outerRadius={100} fill="#8884d8" dataKey="value">
                      <Cell fill="#dc2626" />
                      <Cell fill="#2563eb" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'checklists' && (
          <div>
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

                {nocSection === 'preflight' && (
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-2">NOC - Normal Operations Checklist</h3>
                    <p className="text-slate-400 text-sm mb-6">TEKEVER AR5 (MK2.3) - Version 12 | 08-Oct-2024 | Reference: TAS-AR5-ETN-009_00</p>

                    <div className="bg-slate-700/50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div><label className="text-slate-400 text-xs font-bold uppercase">Aircraft ID</label><input type="text" value={getTextValue('aircraftID')} onChange={(e) => handleInputChange('aircraftID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                      <div><label className="text-slate-400 text-xs font-bold uppercase">Date</label><input type="date" value={getTextValue('date')} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                      <div><label className="text-slate-400 text-xs font-bold uppercase">fGCS ID/Version</label><input type="text" value={getTextValue('fgcsID')} onChange={(e) => handleInputChange('fgcsID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                      <div><label className="text-slate-400 text-xs font-bold uppercase">Location</label><input type="text" value={getTextValue('location')} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                      <div><label className="text-slate-400 text-xs font-bold uppercase">mGCS ID/Version</label><input type="text" value={getTextValue('mgcsID')} onChange={(e) => handleInputChange('mgcsID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                      <div><label className="text-slate-400 text-xs font-bold uppercase">Mission Type</label><input type="text" value={getTextValue('missionType')} onChange={(e) => handleInputChange('missionType', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" /></div>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {[{ id: 0, label: 'Daily Briefing / I\'M SAFE', desc: 'Conducting the Daily Briefing and the I\'M SAFE Procedure', type: 'checkbox' }, { id: 1, label: 'UAS GEO ZONES (ANAC)', desc: 'Consult to check that there are no conflict areas https://dnt.anac.pt/mapa.html', type: 'text', placeholder: 'Copy.Json file name' }, { id: 2, label: 'ProCiv (Civil Protection)', desc: 'Consult to check that there are no emergency response efforts ongoing inside flight areas', type: 'checkbox' }, { id: 3, label: 'Consult NOTAM', desc: 'Consult active NOTAM\'s from NAV.pt', type: 'checkbox' }].map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                          <span className="text-red-500 font-bold min-w-[35px] text-sm">{item.id}.</span>
                          <div className="flex-1"><p className="text-slate-200 font-semibold text-sm">{item.label}</p>{item.desc && <p className="text-slate-400 text-xs mt-1">{item.desc}</p>}</div>
                          {item.type === 'checkbox' ? (
                            <input type="checkbox" checked={getCheckboxValue(`noc-${item.id}`)} onChange={(e) => handleInputChange(`noc-${item.id}`, e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-red-500 flex-shrink-0 mt-1" />
                          ) : (
                            <input type="text" placeholder={item.placeholder || '___'} value={getTextValue(`noc-${item.id}`)} onChange={(e) => handleInputChange(`noc-${item.id}`, e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs w-32 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700 flex gap-8">
                      <div><p className="text-slate-400 text-xs font-bold uppercase mb-2">RPIC Print</p><input type="text" value={getTextValue('rpicPrint')} onChange={(e) => handleInputChange('rpicPrint', e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm w-48" /></div>
                      <div><p className="text-slate-400 text-xs font-bold uppercase mb-2">RPIC Signature</p><input type="text" value={getTextValue('rpicSig')} onChange={(e) => handleInputChange('rpicSig', e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm w-48" /></div>
                    </div>
                  </div>
                )}

                {nocSection === 'prelanding' && <div className="p-6"><h3 className="text-2xl font-black text-white mb-6">Pre-Landing Checklist</h3></div>}
                {nocSection === 'handover' && <div className="p-6"><h3 className="text-2xl font-black text-white mb-6">Pilot Handover</h3></div>}
              </div>
            )}

            {selectedChecklist === 'pdi' && (
              <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
                <h3 className="text-2xl font-black mb-4">PDI - Pre-Delivery Inspection</h3>
                <p className="text-slate-400 mb-6">Pre-Delivery Inspection checklist - items coming soon.</p>
                <div className="p-6 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 text-center">
                  <p className="text-slate-400 text-lg">⏳ PDI checklist items pending...</p>
                  <p className="text-slate-500 text-sm mt-2">Send the PDI fields and they will be added immediately</p>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'fuel' && <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg"><h3 className="text-2xl font-black mb-4">⛽ Fuel Management</h3></div>}
        {currentPage === 'wind' && <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg"><h3 className="text-2xl font-black mb-4">💨 Wind Data</h3></div>}
        {currentPage === 'range' && <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg"><h3 className="text-2xl font-black mb-4">📡 Range & Performance</h3></div>}
      </main>

      <footer className="border-t border-slate-700 mt-12 py-6 text-center text-slate-600 text-xs bg-slate-900">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations | Confidential</p>
      </footer>
    </div>
  );
}
