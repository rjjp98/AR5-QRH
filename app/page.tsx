'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type PageType = 'home' | 'dashboard' | 'checklists' | 'fuel' | 'wind' | 'range';
type ChecklistType = 'noc' | 'pdi';

interface ChecklistItem {
  number: number;
  label: string;
  description?: string;
  type: 'checkbox' | 'text';
}

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
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
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

  // NOC Checklist Items
  const nocItems: ChecklistItem[] = [
    { number: 0, label: 'Daily Briefing / I&apos;M SAFE', type: 'checkbox' },
    { number: 1, label: 'UAS GEO ZONES (ANAC)', type: 'text' },
    { number: 2, label: 'ProCiv (Civil Protection)', type: 'checkbox' },
    { number: 3, label: 'Consult NOTAM', type: 'checkbox' },
    { number: 4, label: 'NOTAM AIRSPACE', type: 'text' },
    { number: 5, label: 'Transponder', type: 'text' },
    { number: 6, label: 'Pre-Delivery Inspection', type: 'text' },
    { number: 7, label: 'Remote ID', type: 'checkbox' },
    { number: 8, label: 'Data Link &amp; Tracker', type: 'checkbox' },
    { number: 9, label: 'Browser', type: 'checkbox' },
    { number: 10, label: 'VPN', type: 'checkbox' },
    { number: 11, label: 'AWS Remote Desktop', type: 'checkbox' },
    { number: 12, label: 'Coms Check', type: 'checkbox' },
    { number: 13, label: 'EPU and Wheel Chocks', type: 'checkbox' },
    { number: 14, label: 'Technician Handover', type: 'text' },
    { number: 15, label: 'SPC Checklist', type: 'text' },
    { number: 16, label: 'Aircraft Level', type: 'checkbox' },
    { number: 17, label: 'Pilot Cover', type: 'checkbox' },
    { number: 18, label: 'Aircraft ON', type: 'checkbox' },
    { number: 19, label: 'System Initializing', type: 'checkbox' },
    { number: 20, label: 'Initialization', type: 'checkbox' },
    { number: 21, label: 'Flight GCS', type: 'checkbox' },
    { number: 22, label: 'Mode', type: 'checkbox' },
    { number: 23, label: 'SPC Ignition Test', type: 'checkbox' },
    { number: 24, label: 'Ignition', type: 'checkbox' },
    { number: 25, label: 'Throttle %', type: 'checkbox' },
    { number: 26, label: 'Accelerometer (EMI check)', type: 'checkbox' },
    { number: 27, label: 'Gyro (EMI check)', type: 'checkbox' },
    { number: 28, label: 'Battery Voltage', type: 'checkbox' },
    { number: 29, label: 'GPS1 (EMI check)', type: 'checkbox' },
    { number: 30, label: 'GPS2 (EMI check)', type: 'checkbox' },
    { number: 31, label: 'SPC Range Check', type: 'checkbox' },
    { number: 32, label: 'Throttle Failsafe', type: 'checkbox' },
    { number: 33, label: 'Magnetometer', type: 'checkbox' },
    { number: 34, label: 'SPC', type: 'checkbox' },
    { number: 35, label: 'Satcom Service', type: 'checkbox' },
    { number: 36, label: 'RLOS (EMI check)', type: 'checkbox' },
    { number: 37, label: 'RLOS-B', type: 'checkbox' },
    { number: 38, label: '4G', type: 'checkbox' },
    { number: 39, label: 'RSSI Graph', type: 'checkbox' },
    { number: 40, label: 'SATCOM IRU + Router', type: 'checkbox' },
    { number: 41, label: 'Payload', type: 'checkbox' },
    { number: 42, label: 'ATLAS', type: 'checkbox' },
    { number: 43, label: 'Radar', type: 'checkbox' },
    { number: 44, label: 'SATCOM-B', type: 'checkbox' },
    { number: 45, label: 'Remaining fuel (sensor)', type: 'text' },
    { number: 46, label: 'Initial fuel level', type: 'text' },
    { number: 47, label: 'Parameters', type: 'checkbox' },
    { number: 48, label: 'GROUND_STEER_ALT', type: 'checkbox' },
    { number: 49, label: 'ALT_HOLD_RTL', type: 'text' },
    { number: 50, label: 'TRIM_ARSPD_CM', type: 'text' },
    { number: 51, label: 'ARSPD_PRIMARY', type: 'checkbox' },
    { number: 52, label: 'Airspeed', type: 'checkbox' },
    { number: 53, label: 'Barometer', type: 'text' },
    { number: 54, label: 'Lidar distance', type: 'checkbox' },
    { number: 55, label: 'Mode FBWA', type: 'checkbox' },
    { number: 56, label: 'Roll Left', type: 'checkbox' },
    { number: 57, label: 'Pitch Up', type: 'checkbox' },
    { number: 58, label: 'Roll Right', type: 'checkbox' },
    { number: 59, label: 'Pilot', type: 'checkbox' },
    { number: 60, label: 'Airspeed 1 Test (EMI check)', type: 'checkbox' },
    { number: 61, label: 'Airspeed 2 Test (EMI check)', type: 'checkbox' },
    { number: 62, label: 'Airspeed 3 Test (EMI check)', type: 'checkbox' },
    { number: 63, label: 'Mode Manual', type: 'checkbox' },
    { number: 64, label: 'Weather Conditions', type: 'checkbox' },
    { number: 65, label: 'Maximum take-off headwind', type: 'text' },
    { number: 66, label: 'Maximum take-off crosswind', type: 'text' },
    { number: 67, label: 'Runway', type: 'checkbox' },
    { number: 68, label: 'Load Areas', type: 'checkbox' },
    { number: 69, label: 'Routes', type: 'checkbox' },
    { number: 70, label: 'Navigation Lights', type: 'checkbox' },
    { number: 71, label: 'Strobe lights', type: 'checkbox' },
    { number: 72, label: 'Landing Lights', type: 'checkbox' },
    { number: 73, label: 'Transponder', type: 'checkbox' },
    { number: 74, label: 'Request Startup', type: 'checkbox' },
    { number: 75, label: 'EPU', type: 'checkbox' },
    { number: 76, label: 'Throttle', type: 'checkbox' },
    { number: 77, label: 'Ignition', type: 'checkbox' },
    { number: 78, label: 'Brakes', type: 'checkbox' },
    { number: 79, label: 'Startup #1 &amp; #2', type: 'text' },
    { number: 80, label: 'Engine Warm Up', type: 'checkbox' },
    { number: 81, label: 'Engine Status', type: 'checkbox' },
    { number: 82, label: 'Engine Temperature', type: 'checkbox' },
    { number: 83, label: 'Ignition tests @3000rpm', type: 'checkbox' },
    { number: 84, label: 'Engine Max RPM Test (5 Seconds)', type: 'text' },
    { number: 85, label: 'Battery Status', type: 'checkbox' },
    { number: 86, label: 'Payload Checklist', type: 'text' },
    { number: 87, label: 'Request Taxi', type: 'checkbox' },
    { number: 88, label: 'Wheel Checks', type: 'checkbox' },
    { number: 89, label: 'Taxi', type: 'checkbox' },
    { number: 90, label: 'Check Controls', type: 'checkbox' },
    { number: 91, label: 'Check Brakes', type: 'checkbox' },
    { number: 92, label: 'Check Steering', type: 'checkbox' },
    { number: 93, label: 'Tracker', type: 'checkbox' },
    { number: 94, label: 'Stop on Runway', type: 'checkbox' },
    { number: 95, label: 'Route', type: 'checkbox' },
    { number: 96, label: 'GCS Warnings', type: 'checkbox' },
    { number: 97, label: 'General Status', type: 'checkbox' },
    { number: 98, label: 'Transponder', type: 'checkbox' },
    { number: 99, label: 'Crew', type: 'checkbox' },
    { number: 100, label: 'Commander', type: 'checkbox' },
    { number: 101, label: 'Request Take-off', type: 'checkbox' },
    { number: 102, label: 'Time info panel', type: 'checkbox' },
    { number: 103, label: 'Engines', type: 'checkbox' },
    { number: 104, label: 'Take-off', type: 'text' },
    { number: 105, label: 'Take-off Complete', type: 'checkbox' },
    { number: 106, label: 'Transit Corridor Payload SURVEY', type: 'checkbox' },
    { number: 107, label: 'Change THR_MIN', type: 'checkbox' },
    { number: 108, label: 'SATCOM &amp; Radar On', type: 'checkbox' },
    { number: 109, label: 'Browser', type: 'checkbox' },
    { number: 110, label: 'GCS Warnings', type: 'checkbox' },
    { number: 111, label: 'Ground Steer', type: 'checkbox' },
    { number: 112, label: 'SPC', type: 'checkbox' },
    { number: 113, label: 'Rally points', type: 'checkbox' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      {/* Header */}
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

      {/* Navigation */}
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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HOME PAGE */}
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
                  <div className="flex justify-between">
                    <span>Aircraft Status:</span>
                    <span className="text-green-400 font-bold">🟢 Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Mission:</span>
                    <span className="text-slate-300">2026-07-01 14:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Flights:</span>
                    <span className="text-slate-300">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight Hours:</span>
                    <span className="text-slate-300">1,240h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-8 text-white shadow-lg">
              <h3 className="text-2xl font-black mb-4">About AR5 MK3</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                The AR5 MK3 is a state-of-the-art tactical remotely piloted aircraft designed for extended operations with multi-sensor payload capabilities. 
                This QRH (Quick Reference Handbook) provides all necessary procedures and checklists for normal operations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-500">12h</p>
                  <p className="text-xs text-slate-400">Max Endurance</p>
                </div>
                <div className="bg-slate-700 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-500">150km</p>
                  <p className="text-xs text-slate-400">Max Range</p>
                </div>
                <div className="bg-slate-700 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-500">130km/h</p>
                  <p className="text-xs text-slate-400">Max Speed</p>
                </div>
                <div className="bg-slate-700 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-500">5000m</p>
                  <p className="text-xs text-slate-400">Max Altitude</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
                <p className="text-sm opacity-80">Total Missions</p>
                <p className="text-4xl font-black">247</p>
                <p className="text-xs text-blue-200 mt-2">+5 this month</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
                <p className="text-sm opacity-80">Flight Hours</p>
                <p className="text-4xl font-black">1,240h</p>
                <p className="text-xs text-green-200 mt-2">+45h this month</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white shadow-lg">
                <p className="text-sm opacity-80">Avg Endurance</p>
                <p className="text-4xl font-black">11.2h</p>
                <p className="text-xs text-yellow-200 mt-2">Last 10 flights</p>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white shadow-lg">
                <p className="text-sm opacity-80">Aircraft Health</p>
                <p className="text-4xl font-black">98%</p>
                <p className="text-xs text-red-200 mt-2">🟢 Ready</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
                <h3 className="text-xl font-black mb-4">Monthly Missions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { month: 'Week 1', missions: 12 },
                    { month: 'Week 2', missions: 15 },
                    { month: 'Week 3', missions: 10 },
                    { month: 'Week 4', missions: 13 },
                  ]}>
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
                    <Pie data={[
                      { name: 'Training', value: 340 },
                      { name: 'Operations', value: 680 },
                      { name: 'Maintenance', value: 220 },
                    ]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}h`} outerRadius={100} fill="#8884d8" dataKey="value">
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

        {/* CHECKLISTS PAGE */}
        {currentPage === 'checklists' && (
          <div>
            <div className="flex gap-4 mb-6">
              <button onClick={() => setSelectedChecklist('noc')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'noc' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                NOC - Normal Operations
              </button>
              <button onClick={() => setSelectedChecklist('pdi')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'pdi' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                PDI - Pre-Delivery Inspection
              </button>
            </div>

            {selectedChecklist === 'noc' && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-700">
                  <h3 className="text-2xl font-black text-white mb-2">NOC - Normal Operations Checklist</h3>
                  <p className="text-slate-400 text-sm">Complete checklist with 113 items covering all phases of flight.</p>
                </div>

                <div className="p-6 max-h-[800px] overflow-y-auto">
                  <div className="space-y-4">
                    {nocItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                        <span className="text-red-500 font-bold min-w-[40px]">{item.number}.</span>
                        <span className="text-slate-200 flex-1 font-semibold">{item.label}</span>
                        {item.type === 'checkbox' ? (
                          <input
                            type="checkbox"
                            checked={(formData[`noc-${item.number}`] as boolean) || false}
                            onChange={(e) => handleInputChange(`noc-${item.number}`, e.target.checked)}
                            className="w-5 h-5 rounded cursor-pointer accent-red-500"
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder="___"
                            value={(formData[`noc-${item.number}`] as string) || ''}
                            onChange={(e) => handleInputChange(`noc-${item.number}`, e.target.value)}
                            className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm w-32"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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

        {/* FUEL PAGE */}
        {currentPage === 'fuel' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-2xl font-black mb-4">⛽ Fuel Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input type="date" value={newFuel.date} onChange={(e) => setNewFuel({ ...newFuel, date: e.target.value })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Date" />
                <input type="number" value={newFuel.quantity} onChange={(e) => setNewFuel({ ...newFuel, quantity: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Quantity (L)" />
                <select value={newFuel.type} onChange={(e) => setNewFuel({ ...newFuel, type: e.target.value })} className="bg-slate-700 text-white px-4 py-2 rounded">
                  <option>Avgas</option>
                  <option>Jet A</option>
                  <option>Other</option>
                </select>
              </div>
              
              <button onClick={handleAddFuel} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition mb-6">
                ➕ Add Fuel Entry
              </button>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-600">
                    <tr>
                      <th className="pb-3 font-bold text-red-500">Date</th>
                      <th className="pb-3 font-bold text-red-500">Quantity (L)</th>
                      <th className="pb-3 font-bold text-red-500">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelLog.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3">{entry.date}</td>
                        <td className="py-3">{entry.quantity}L</td>
                        <td className="py-3">{entry.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WIND PAGE */}
        {currentPage === 'wind' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-2xl font-black mb-4">💨 Wind Data</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input type="time" value={newWind.time} onChange={(e) => setNewWind({ ...newWind, time: e.target.value })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Time" />
                <input type="number" value={newWind.speed} onChange={(e) => setNewWind({ ...newWind, speed: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Speed (km/h)" />
                <input type="number" value={newWind.direction} onChange={(e) => setNewWind({ ...newWind, direction: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Direction (°)" />
                <input type="number" value={newWind.gusts} onChange={(e) => setNewWind({ ...newWind, gusts: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Gusts (km/h)" />
              </div>

              <button onClick={handleAddWind} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition mb-6">
                ➕ Add Wind Entry
              </button>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={windLog}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="speed" stroke="#dc2626" name="Wind Speed (km/h)" />
                  <Line type="monotone" dataKey="gusts" stroke="#f59e0b" name="Gusts (km/h)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* RANGE PAGE */}
        {currentPage === 'range' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-2xl font-black mb-4">📡 Range &amp; Performance</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input type="number" value={newRange.distance} onChange={(e) => setNewRange({ ...newRange, distance: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Distance (km)" />
                <input type="number" value={newRange.battery} onChange={(e) => setNewRange({ ...newRange, battery: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Battery (%)" />
                <input type="number" value={newRange.altitude} onChange={(e) => setNewRange({ ...newRange, altitude: parseInt(e.target.value) })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Altitude (m)" />
                <input type="time" value={newRange.time} onChange={(e) => setNewRange({ ...newRange, time: e.target.value })} className="bg-slate-700 text-white px-4 py-2 rounded" placeholder="Time" />
              </div>

              <button onClick={handleAddRange} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition mb-6">
                ➕ Add Range Entry
              </button>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={rangeLog}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="distance" stroke="#2563eb" name="Distance (km)" />
                  <Line type="monotone" dataKey="battery" stroke="#10b981" name="Battery (%)" />
                  <Line type="monotone" dataKey="altitude" stroke="#f59e0b" name="Altitude (m)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6 text-center text-slate-600 text-xs bg-slate-900">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations | Confidential</p>
      </footer>
    </div>
  );
}
