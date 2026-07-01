'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type PageType = 'home' | 'dashboard' | 'checklists' | 'fuel' | 'wind' | 'range';
type ChecklistType = 'noc' | 'pdi';
type NOCSection = 'preflight' | 'prelanding' | 'handover';

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
            <div className="flex gap-4 mb-6 flex-wrap">
              <button onClick={() => setSelectedChecklist('noc')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'noc' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                NOC - Normal Operations
              </button>
              <button onClick={() => setSelectedChecklist('pdi')} className={`px-6 py-2 font-bold rounded-lg transition ${selectedChecklist === 'pdi' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                PDI - Pre-Delivery Inspection
              </button>
            </div>

            {selectedChecklist === 'noc' && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                {/* NOC Section Tabs */}
                <div className="flex border-b border-slate-700 bg-slate-700/50">
                  <button onClick={() => setNocSection('preflight')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'preflight' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>
                    Pre-Flight
                  </button>
                  <button onClick={() => setNocSection('prelanding')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'prelanding' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>
                    Pre-Landing
                  </button>
                  <button onClick={() => setNocSection('handover')} className={`flex-1 py-4 px-4 font-bold transition border-b-2 ${nocSection === 'handover' ? 'text-red-500 border-red-500' : 'text-slate-300 border-transparent hover:text-white'}`}>
                    Pilot Handover
                  </button>
                </div>

                {/* PRE-FLIGHT SECTION */}
                {nocSection === 'preflight' && (
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-2">NOC - Normal Operations Checklist</h3>
                    <p className="text-slate-400 text-sm mb-6">TEKEVER AR5 (MK2.3) - Version 12 | 08-Oct-2024 | Reference: TAS-AR5-ETN-009_00</p>

                    {/* Flight Details */}
                    <div className="bg-slate-700/50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">Aircraft ID</label>
                        <input type="text" value={formData['aircraftID'] || ''} onChange={(e) => handleInputChange('aircraftID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">Date</label>
                        <input type="date" value={formData['date'] || ''} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">fGCS ID/Version</label>
                        <input type="text" value={formData['fgcsID'] || ''} onChange={(e) => handleInputChange('fgcsID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">Location</label>
                        <input type="text" value={formData['location'] || ''} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">mGCS ID/Version</label>
                        <input type="text" value={formData['mgcsID'] || ''} onChange={(e) => handleInputChange('mgcsID', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-bold uppercase">Mission Type</label>
                        <input type="text" value={formData['missionType'] || ''} onChange={(e) => handleInputChange('missionType', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                      </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {[
                        { id: 0, label: 'Daily Briefing / I\'M SAFE', desc: 'Conducting the Daily Briefing and the I\'M SAFE Procedure', type: 'checkbox' },
                        { id: 1, label: 'UAS GEO ZONES (ANAC)', desc: 'Consult to check that there are no conflict areas https://dnt.anac.pt/mapa.html', type: 'text', placeholder: 'Copy.Json file name' },
                        { id: 2, label: 'ProCiv (Civil Protection)', desc: 'Consult to check that there are no emergency response efforts ongoing inside flight areas', type: 'checkbox' },
                        { id: 3, label: 'Consult NOTAM', desc: 'Consult active NOTAM\'s from NAV.pt', type: 'checkbox' },
                        { id: 4, label: 'Contact LISBOAMIL', desc: 'Request the activation of flight areas', type: 'text', placeholder: 'Active flight areas' },
                        { id: 5, label: 'Transponder Code', desc: 'When activating Areas or Corridors request the assignment of a specific transponder code', type: 'text', placeholder: 'Assigned transponder code' },
                        { id: 6, label: 'Pre-Delivery Inspection', type: 'checkbox' },
                        { id: 7, label: 'Remote ID', desc: 'Remote ID Switch ON. Check that everything is OK.', type: 'checkbox' },
                        { id: 8, label: 'Data Link & Tracker', desc: 'Data Link & Tracker ON', type: 'checkbox' },
                        { id: 9, label: 'Browser', desc: 'Check local radio settings', type: 'checkbox' },
                        { id: 10, label: 'VPN', desc: 'VPN ON', type: 'checkbox' },
                        { id: 11, label: 'AWS Remote Desktop', desc: 'Start all (telemetry and OBC)', type: 'checkbox' },
                        { id: 12, label: 'Coms Check', type: 'checkbox' },
                        { id: 13, label: 'EPU and Wheel Chocks', desc: 'Check EPU ON and Chocks fitted', type: 'checkbox' },
                        { id: 14, label: 'Technician Handover', desc: 'Aircraft OK', type: 'text', placeholder: 'Fuel Quantity (L)' },
                        { id: 15, label: 'SPC Checklist', type: 'checkbox' },
                        { id: 16, label: 'Aircraft Level', desc: '±5 degrees pitch ±5 degrees roll', type: 'checkbox' },
                        { id: 17, label: 'Pitot Cover', desc: 'Fitted', type: 'checkbox' },
                        { id: 18, label: 'Aircraft ON', desc: 'Critical & Non-Critical', type: 'checkbox' },
                        { id: 19, label: 'System Initializing', desc: 'Wait 30 seconds', type: 'checkbox' },
                        { id: 20, label: 'Initialization Complete', type: 'checkbox' },
                        { id: 21, label: 'Flight GCS', desc: 'Show config editor / load / start selected', type: 'checkbox' },
                        { id: 22, label: 'Mode', desc: 'Manual', type: 'checkbox' },
                        { id: 23, label: 'SPC Ignition Test', desc: 'Turn OFF and back ON, Check OFF in GCS', type: 'checkbox' },
                        { id: 24, label: 'Ignition', desc: 'Ignition ON', type: 'checkbox' },
                        { id: 25, label: 'Throttle %', type: 'text', placeholder: 'Value' },
                        { id: 26, label: 'Accelerometer (EMI check)', desc: 'AR5imu1 & AR5imu2 Check ranges', type: 'checkbox' },
                        { id: 27, label: 'Gyro (EMI check)', desc: 'AR5imu1 & AR5imu2 Check ranges', type: 'checkbox' },
                        { id: 28, label: 'Battery Voltage', desc: 'GPU Critical & NON critical > 24500 V', type: 'text', placeholder: 'Voltage' },
                        { id: 29, label: 'GPS1 (EMI check)', desc: 'Hdop<1, 3DFix & sat>14', type: 'checkbox' },
                        { id: 30, label: 'GPS2 (EMI check)', desc: 'Hdop<1, 3DFix & sat>14', type: 'checkbox' },
                        { id: 31, label: 'SPC Range Check', desc: 'Clear to perform range check', type: 'checkbox' },
                        { id: 32, label: 'Throttle Failsafe', desc: 'Check autopilot messages', type: 'checkbox' },
                        { id: 33, label: 'Magnetometer', desc: 'Run graph and check coherent', type: 'checkbox' },
                        { id: 34, label: 'SPC', desc: 'Confirm RC OFF and ON accordingly', type: 'checkbox' },
                        { id: 35, label: 'Satcom Service', desc: 'ON', type: 'checkbox' },
                        { id: 36, label: 'RLOS (EMI check)', desc: 'OK (100%) & RSSI>-15', type: 'checkbox' },
                        { id: 37, label: 'RLOS-B', desc: 'OK (100%)', type: 'checkbox' },
                        { id: 38, label: '4G', desc: 'OK (100%)', type: 'checkbox' },
                        { id: 39, label: 'RSSI Graph', desc: 'Check ok', type: 'checkbox' },
                        { id: 40, label: 'SATCOM IRU + Router', desc: 'ON', type: 'checkbox' },
                        { id: 41, label: 'Payload', desc: 'Payload ON', type: 'checkbox' },
                        { id: 42, label: 'ATLAS', desc: 'Start mission exporter stream and create mission', type: 'checkbox' },
                        { id: 43, label: 'Radar', desc: 'ON & Standby mode', type: 'checkbox' },
                        { id: 44, label: 'SATCOM-B', desc: '100%', type: 'checkbox' },
                        { id: 45, label: 'Remaining fuel (sensor)', type: 'text', placeholder: 'Value (L)' },
                        { id: 46, label: 'Initial fuel level', type: 'text', placeholder: 'Value (L)' },
                        { id: 47, label: 'Parameters', desc: 'Refresh', type: 'checkbox' },
                        { id: 48, label: 'GROUND_STEER_ALT', desc: 'VALUE 5', type: 'text', placeholder: '5' },
                        { id: 49, label: 'ALT_HOLD_RTL', desc: 'VALUE -1', type: 'text', placeholder: '-1' },
                        { id: 50, label: 'TRIM_ARSPD_CM', desc: '2700 <150kg, 2800 >150kg, 2900 >165kg', type: 'text', placeholder: 'Value' },
                        { id: 51, label: 'ARSPD_PRIMARY', desc: 'VALUE 0', type: 'text', placeholder: '0' },
                        { id: 52, label: 'Airspeed', desc: '0<VALUE<10', type: 'text', placeholder: 'Value' },
                        { id: 53, label: 'Barometer', type: 'text', placeholder: 'mBar' },
                        { id: 54, label: 'Lidar distance', desc: 'Start graph, Check value>0 and within ]0:3]', type: 'text', placeholder: 'Value' },
                        { id: 55, label: 'Mode FBWA', type: 'checkbox' },
                        { id: 56, label: 'Roll Left', desc: 'Check Left Aileron Down / Right Aileron Up', type: 'checkbox' },
                        { id: 57, label: 'Pitch Up', desc: 'Check Elevators Down', type: 'checkbox' },
                        { id: 58, label: 'Roll Right', desc: 'Check Left Aileron Up / Right Aileron Down', type: 'checkbox' },
                        { id: 59, label: 'Pitot', desc: 'Remove cover', type: 'checkbox' },
                        { id: 60, label: 'Airspeed 1 Test (EMI check)', desc: 'Elevator Up / Airspeed1 alive', type: 'checkbox' },
                        { id: 61, label: 'Airspeed 2 Test (EMI check)', desc: 'Airspeed2 alive', type: 'checkbox' },
                        { id: 62, label: 'Airspeed 3 Test (EMI check)', desc: 'Airspeed3 alive', type: 'checkbox' },
                        { id: 63, label: 'Mode Manual', type: 'checkbox' },
                        { id: 64, label: 'Weather Conditions', desc: 'Check and fill hourly log table', type: 'checkbox' },
                        { id: 65, label: 'Maximum take-off headwind', type: 'text', placeholder: 'Value >>>' },
                        { id: 66, label: 'Maximum take-off crosswind', type: 'text', placeholder: 'Value >>>' },
                        { id: 67, label: 'Runway', desc: 'Check runway for departure', type: 'checkbox' },
                        { id: 68, label: 'Load Areas', desc: 'Load NOTAM & Operational Areas', type: 'checkbox' },
                        { id: 69, label: 'Routes', desc: 'Read / Load / Write', type: 'checkbox' },
                        { id: 70, label: 'Navigation Lights', desc: 'ON', type: 'checkbox' },
                        { id: 71, label: 'Strobe lights', desc: 'ON', type: 'checkbox' },
                        { id: 72, label: 'Landing Lights', desc: 'ON & OFF', type: 'checkbox' },
                        { id: 73, label: 'Transponder', desc: 'ON & Standby mode', type: 'checkbox' },
                        { id: 74, label: 'Request Startup', type: 'text', placeholder: 'Permission Granted' },
                        { id: 75, label: 'EPU', desc: 'Remove EPU / Close Hatch', type: 'checkbox' },
                        { id: 76, label: 'Throttle', desc: 'Idle', type: 'checkbox' },
                        { id: 77, label: 'Ignition', desc: 'ON', type: 'checkbox' },
                        { id: 78, label: 'Brakes', desc: 'ON', type: 'checkbox' },
                        { id: 79, label: 'Startup #1 & #2', type: 'text', placeholder: 'Time __:__' },
                        { id: 80, label: 'Engine Warm Up', desc: 'Approx. 2000RPM', type: 'checkbox' },
                        { id: 81, label: 'Engine Status', desc: 'Check Engine Sensors Alive and Plausible', type: 'checkbox' },
                        { id: 82, label: 'Engine Temperature', desc: 'Check >=100ºC #1 & #2', type: 'checkbox' },
                        { id: 83, label: 'Ignition tests @3000rpm', desc: 'CDI 1-4 OFF/ON Check TPS', type: 'checkbox' },
                        { id: 84, label: 'Engine Max RPM Test', desc: '(check>5200RPM)', type: 'text', placeholder: 'Max RPM' },
                        { id: 85, label: 'Battery Status', desc: 'Check Generator & voltage > 27V', type: 'checkbox' },
                        { id: 86, label: 'Payload Checklist', type: 'checkbox' },
                        { id: 87, label: 'Request Taxi', type: 'text', placeholder: 'Permission Granted' },
                        { id: 88, label: 'Wheel Chocks', desc: 'Removed', type: 'checkbox' },
                        { id: 89, label: 'Taxi', desc: 'Clear Taxi', type: 'checkbox' },
                        { id: 90, label: 'Check Controls', desc: 'Manual and FBWA', type: 'checkbox' },
                        { id: 91, label: 'Check Brakes', desc: 'Manual and FBWA', type: 'checkbox' },
                        { id: 92, label: 'Check Steering', desc: 'Manual and FBWA', type: 'checkbox' },
                        { id: 93, label: 'Tracker', desc: 'Tracking Aircraft Correctly', type: 'checkbox' },
                        { id: 94, label: 'Stop on Runway', desc: 'Set Home Altitude & Set Home Position', type: 'checkbox' },
                        { id: 95, label: 'Route', desc: 'Check route altitudes and write to aircraft', type: 'checkbox' },
                        { id: 96, label: 'GCS Warnings', desc: 'Waypoint ON, Mode ON, Comms ON', type: 'checkbox' },
                        { id: 97, label: 'General Status', desc: 'Check', type: 'checkbox' },
                        { id: 98, label: 'Transponder', desc: 'ON & Mode ACS', type: 'checkbox' },
                        { id: 99, label: 'Crew', desc: 'Clear', type: 'checkbox' },
                        { id: 100, label: 'Commander', desc: 'Clear', type: 'checkbox' },
                        { id: 101, label: 'Request Take-off', type: 'text', placeholder: 'Permission Granted' },
                        { id: 102, label: 'Time info panel', desc: 'Start Mission', type: 'text', placeholder: 'Time' },
                        { id: 103, label: 'Engines', desc: 'Clear Engines', type: 'checkbox' },
                        { id: 104, label: 'Take-off', type: 'text', placeholder: 'Time __:__' },
                        { id: 105, label: 'Take-off Complete', desc: 'General Status OK', type: 'checkbox' },
                        { id: 106, label: 'Transit Corridor Payload', desc: 'SURVEY Use GIMBAL', type: 'checkbox' },
                        { id: 107, label: 'Change THR_MIN', desc: 'Change to 30%', type: 'checkbox' },
                        { id: 108, label: 'SATCOM & Radar On', desc: 'Radar, Satcom VMBR + ACU', type: 'checkbox' },
                        { id: 109, label: 'Browser', desc: 'Check Satcom (IP 192.168.0.1)', type: 'checkbox' },
                        { id: 110, label: 'GCS Warnings', desc: 'Battery Set ON 24V', type: 'checkbox' },
                        { id: 111, label: 'Ground Steer', desc: 'Set GROUND_STEER_ALT = 0', type: 'checkbox' },
                        { id: 112, label: 'SPC', desc: 'Off', type: 'checkbox' },
                        { id: 113, label: 'Rally points', desc: 'Set Rally points', type: 'checkbox' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                          <span className="text-red-500 font-bold min-w-[35px] text-sm">{item.id}.</span>
                          <div className="flex-1">
                            <p className="text-slate-200 font-semibold text-sm">{item.label}</p>
                            {item.desc && <p className="text-slate-400 text-xs mt-1">{item.desc}</p>}
                          </div>
                          {item.type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={(formData[`noc-${item.id}`] as boolean) || false}
                              onChange={(e) => handleInputChange(`noc-${item.id}`, e.target.checked)}
                              className="w-4 h-4 rounded cursor-pointer accent-red-500 flex-shrink-0 mt-1"
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder={item.placeholder || '___'}
                              value={(formData[`noc-${item.id}`] as string) || ''}
                              onChange={(e) => handleInputChange(`noc-${item.id}`, e.target.value)}
                              className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs w-32 flex-shrink-0"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* RPIC Signature */}
                    <div className="mt-6 pt-6 border-t border-slate-700 flex gap-8">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-2">RPIC Print</p>
                        <input type="text" value={formData['rpicPrint'] || ''} onChange={(e) => handleInputChange('rpicPrint', e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm w-48" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-2">RPIC Signature</p>
                        <input type="text" value={formData['rpicSig'] || ''} onChange={(e) => handleInputChange('rpicSig', e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm w-48" />
                      </div>
                    </div>
                  </div>
                )}

                {/* PRE-LANDING SECTION */}
                {nocSection === 'prelanding' && (
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-6">Pre-Landing Checklist</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {[
                        { id: 1, label: 'ProCiv (Civil Protection)', desc: 'Consult to check emergency response efforts' },
                        { id: 2, label: 'Check loiter direction', desc: 'CW or CCW' },
                        { id: 3, label: 'SATCOM OFF', desc: 'Satcom VMBR + ACU' },
                        { id: 4, label: 'Change THR_MIN', desc: 'Change THR_MIN to 0%' },
                        { id: 5, label: 'Ground Steer', desc: 'Set GROUND_STEER_ALT = 5' },
                        { id: 6, label: 'TRIM_ARSPD_CM', desc: 'Check value and landing weight' },
                        { id: 7, label: 'Radar', desc: 'STDBY' },
                        { id: 8, label: 'Coms Check', desc: 'OK' },
                        { id: 9, label: 'Aircraft In Sight' },
                        { id: 10, label: 'SPC Checklist', desc: 'OK & ON' },
                        { id: 11, label: 'Brakes', desc: 'OFF' },
                        { id: 12, label: 'Lights', desc: 'ON' },
                        { id: 13, label: 'Gimbal', desc: 'Check landing gear & protect' },
                        { id: 14, label: 'Clearance', desc: 'Permission to land' },
                        { id: 15, label: 'GCS Warnings', desc: 'Set Altitude Warning OFF' },
                        { id: 16, label: 'Landing', type: 'time' },
                        { id: 17, label: 'Vacate Runway', desc: 'Vacated' },
                        { id: 18, label: 'Strobes', desc: 'OFF' },
                        { id: 19, label: 'Request taxi', desc: 'Permission granted' },
                        { id: 20, label: 'Satcom service', desc: 'OFF' },
                        { id: 21, label: 'Transponder', desc: 'Set Standby then switch OFF' },
                        { id: 22, label: 'Engine Off', type: 'time' },
                        { id: 23, label: 'Remaining fuel (sensor)', type: 'text' },
                        { id: 24, label: 'Remaining fuel (integrated)', type: 'text' },
                        { id: 25, label: 'EPU', desc: 'Connected' },
                        { id: 26, label: 'Battery status', desc: 'Check external and <27V' },
                        { id: 27, label: 'Lights', desc: 'Nav and land OFF' },
                        { id: 28, label: 'Post Flight Walk-around', desc: 'Begin' },
                        { id: 29, label: 'Time info panel', desc: 'Stop Mission' },
                        { id: 30, label: 'Deactivate areas', desc: 'Return transponder code (LISBOAMIL)' },
                        { id: 31, label: 'Video REC', desc: 'Stop' },
                        { id: 32, label: 'ATLAS', desc: 'Download Report' },
                        { id: 33, label: 'Radar', desc: 'ON' },
                        { id: 34, label: 'Download Data', desc: 'Gimbal & Radar' },
                        { id: 35, label: 'Comms Manager', desc: 'Shutdown' },
                        { id: 36, label: 'Post Flight Walk-around', desc: 'Complete' },
                        { id: 37, label: 'Remote ID', desc: 'OFF' },
                        { id: 38, label: 'Aircraft OFF', desc: 'Critical & Non-Critical' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                          <span className="text-red-500 font-bold min-w-[30px] text-sm">{item.id}.</span>
                          <div className="flex-1">
                            <p className="text-slate-200 font-semibold text-sm">{item.label}</p>
                            {item.desc && <p className="text-slate-400 text-xs mt-1">{item.desc}</p>}
                          </div>
                          {!item.type ? (
                            <input type="checkbox" defaultChecked={false} className="w-4 h-4 rounded cursor-pointer accent-red-500 flex-shrink-0 mt-1" />
                          ) : (
                            <input type={item.type} className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs w-32 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PILOT HANDOVER SECTION */}
                {nocSection === 'handover' && (
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-6">Pilot Handover</h3>

                    {/* Mission Details */}
                    <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Mission Details</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-slate-400 text-xs font-bold uppercase">Callsign / Airspace Deconfliction / Objective / MET / RTB Time</label>
                          <textarea value={formData['missionDetails'] || ''} onChange={(e) => handleInputChange('missionDetails', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm mt-1 h-20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Airspace Active</label>
                            <input type="text" value={formData['airspaceActive'] || ''} onChange={(e) => handleInputChange('airspaceActive', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                          </div>
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Time Deactivated</label>
                            <input type="time" value={formData['timeDeactivated'] || ''} onChange={(e) => handleInputChange('timeDeactivated', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aircraft Status */}
                    <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Aircraft Status</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-slate-400 text-xs font-bold uppercase">System Config / Engine Parameters / Fuel & Bingo / Limitations</label>
                          <textarea value={formData['aircraftStatus'] || ''} onChange={(e) => handleInputChange('aircraftStatus', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm mt-1 h-20" />
                        </div>
                      </div>
                    </div>

                    {/* Communication Status */}
                    <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Communication Status</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-slate-400 text-xs font-bold uppercase">Datalinks / AWS / LOS Range / Serviceability</label>
                          <textarea value={formData['commStatus'] || ''} onChange={(e) => handleInputChange('commStatus', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm mt-1 h-20" />
                        </div>
                      </div>
                    </div>

                    {/* Crew Details */}
                    {[1, 2, 3].map((crewNum) => (
                      <div key={crewNum} className="bg-slate-700/50 p-4 rounded-lg mb-4">
                        <h4 className="text-lg font-bold text-white mb-4">Crew Details #{crewNum}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Name</label>
                            <input type="text" value={formData[`crewName${crewNum}`] || ''} onChange={(e) => handleInputChange(`crewName${crewNum}`, e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                          </div>
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Time of Change</label>
                            <input type="time" value={formData[`crewTime${crewNum}`] || ''} onChange={(e) => handleInputChange(`crewTime${crewNum}`, e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Remarks</label>
                            <textarea value={formData[`crewRemarks${crewNum}`] || ''} onChange={(e) => handleInputChange(`crewRemarks${crewNum}`, e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1 h-12" />
                          </div>
                          <div>
                            <label className="text-slate-400 text-xs font-bold uppercase">Signature</label>
                            <input type="text" value={formData[`crewSig${crewNum}`] || ''} onChange={(e) => handleInputChange(`crewSig${crewNum}`, e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-slate-400 font-bold">
                          <div>
                            <label className="uppercase">Handling Pilot</label>
                            <input type="checkbox" className="mt-2 w-4 h-4" />
                          </div>
                          <div>
                            <label className="uppercase">Relieving Pilot</label>
                            <input type="checkbox" className="mt-2 w-4 h-4" />
                          </div>
                          <div>
                            <label className="uppercase">MxC / RPIC</label>
                            <input type="checkbox" className="mt-2 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              <h3 className="text-2xl font-black mb-4">📡 Range & Performance</h3>

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
