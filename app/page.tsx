'use client';

import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function NOC() {
  const [activeTab, setActiveTab] = useState('checklists');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'checklists', label: 'CHECKLISTS' },
    { id: 'noc', label: 'NOC' },
    { id: 'emergencies', label: 'EMERGENCIES' },
    { id: 'fuel', label: 'FUEL' },
    { id: 'range', label: 'RANGE' },
  ];

  const handleTabChange = (tabId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
    }, 300);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const exportPDF = () => {
    const element = document.getElementById('noc-content');
    const opt = {
      margin: 10,
      filename: 'AR5_MK3_NOC.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const ChecklistItem = ({
    id,
    number,
    label,
    type = 'checkbox',
    placeholder = '',
  }: {
    id: string;
    number: number;
    label: string;
    type?: 'checkbox' | 'text' | 'number';
    placeholder?: string;
  }) => (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-slate-700/30 hover:bg-white/5 transition">
      <span className="text-cyan-400 font-bold w-8">{number}</span>
      <span className="text-slate-200 flex-1">{label}</span>
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={formData[id] || false}
          onChange={(e) => handleInputChange(id, e.target.checked)}
          className="w-5 h-5 cursor-pointer accent-red-500"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={formData[id] || ''}
          onChange={(e) => handleInputChange(id, e.target.value)}
          className="px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white placeholder-slate-500 w-32"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#000000]" />

      {/* Dynamic glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header */}
      <header className="relative z-40 border-b border-red-600/10 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <svg width="140" height="40" viewBox="0 0 140 40" className="fill-red-600 drop-shadow-lg">
              <text x="0" y="32" fontSize="28" fontWeight="bold" letterSpacing="2">
                TEKEVER
              </text>
            </svg>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-4 md:gap-8 justify-center flex-1">
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

      {/* Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-10">
        {/* NOC Tab */}
        {activeTab === 'noc' && (
          <div className="text-white">
            {/* Export Button */}
            <div className="mb-8 flex gap-4">
              <button
                onClick={exportPDF}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition"
              >
                📥 EXPORT PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition"
              >
                🖨️ PRINT
              </button>
            </div>

            <div id="noc-content" className="space-y-8">
              {/* Header Info */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-4xl font-black text-white mb-6">AR5 MK3 - NOC</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Aircraft ID</label>
                    <input
                      type="text"
                      placeholder="AR5-001"
                      onChange={(e) => handleInputChange('aircraft_id', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Date</label>
                    <input
                      type="date"
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">RPIC</label>
                    <input
                      type="text"
                      placeholder="Pilot Name"
                      onChange={(e) => handleInputChange('rpic', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Location</label>
                    <input
                      type="text"
                      placeholder="Location"
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* PRE-FLIGHT SECTION */}
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-2xl font-black text-cyan-400">PRE-FLIGHT</h2>
                </div>

                <div className="space-y-2">
                  <ChecklistItem id="pre_flight_1" number={1} label="Daily Briefing / I'M SAFE" />
                  <ChecklistItem id="pre_flight_2" number={2} label="UAS GEO ZONES (ANAC)" />
                  <ChecklistItem id="pre_flight_3" number={3} label="ProCiv (Civil Protection)" />
                  <ChecklistItem id="pre_flight_4" number={4} label="Consult NOTAM" />
                  <ChecklistItem id="pre_flight_5" number={5} label="Contact LISBOAMIL" />
                  <ChecklistItem id="pre_flight_6" number={6} label="Remote ID Switch ON" />
                  <ChecklistItem id="pre_flight_7" number={7} label="Data Link & Tracker ON" />
                  <ChecklistItem id="pre_flight_8" number={8} label="Browser Check" />
                  <ChecklistItem id="pre_flight_9" number={9} label="VPN ON" />
                  <ChecklistItem id="pre_flight_10" number={10} label="AWS Remote Desktop" />
                  <ChecklistItem id="pre_flight_11" number={11} label="Comms Check OK" />
                  <ChecklistItem id="pre_flight_fuel" number={12} label="Fuel Quantity (L)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pre_flight_weight" number={13} label="Take Off Weight (kg)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pre_flight_14" number={14} label="Aircraft Level (±5°)" />
                  <ChecklistItem id="pre_flight_15" number={15} label="Pitot Cover Fitted" />
                  <ChecklistItem id="pre_flight_16" number={16} label="Battery Voltage (V)" type="number" placeholder="27.0" />
                  <ChecklistItem id="pre_flight_17" number={17} label="GPS1 Lock" />
                  <ChecklistItem id="pre_flight_18" number={18} label="GPS2 Lock" />
                </div>
              </div>

              {/* ENGINE START SECTION */}
              <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-red-600"></div>
                  <h2 className="text-2xl font-black text-red-400">ENGINE START</h2>
                </div>

                <div className="space-y-2">
                  <ChecklistItem id="engine_1" number={1} label="EPU Remove / Close Hatch" />
                  <ChecklistItem id="engine_2" number={2} label="Throttle Idle" />
                  <ChecklistItem id="engine_3" number={3} label="Ignition ON" />
                  <ChecklistItem id="engine_4" number={4} label="Brakes ON" />
                  <ChecklistItem id="engine_startup" number={5} label="Startup Time" type="text" placeholder="HH:MM" />
                  <ChecklistItem id="engine_5" number={6} label="Engine Warm Up (~2000RPM)" />
                  <ChecklistItem id="engine_rpm" number={7} label="Engine RPM" type="number" placeholder="2000" />
                  <ChecklistItem id="engine_temp" number={8} label="Engine Temperature (°C)" type="number" placeholder="100" />
                  <ChecklistItem id="engine_6" number={9} label="Battery Status (>27V)" />
                  <ChecklistItem id="engine_7" number={10} label="Ignition Tests Complete" />
                  <ChecklistItem id="engine_8" number={11} label="Max RPM Test (>5200)" />
                  <ChecklistItem id="engine_9" number={12} label="Payload Checklist Complete" />
                </div>
              </div>

              {/* TAXI & TAKEOFF SECTION */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-2xl font-black text-cyan-400">TAXI & TAKEOFF</h2>
                </div>

                <div className="space-y-2">
                  <ChecklistItem id="taxi_1" number={1} label="Request Taxi - Permission Granted" />
                  <ChecklistItem id="taxi_2" number={2} label="Wheel Chocks Removed" />
                  <ChecklistItem id="taxi_3" number={3} label="Taxi Clear" />
                  <ChecklistItem id="taxi_4" number={4} label="Controls Manual & FBWA" />
                  <ChecklistItem id="taxi_5" number={5} label="Brakes Manual & FBWA" />
                  <ChecklistItem id="taxi_6" number={6} label="Tracker Tracking" />
                  <ChecklistItem id="takeoff_wind" number={7} label="Takeoff Wind (kt)" type="number" placeholder="0.0" />
                  <ChecklistItem id="takeoff_weather" number={8} label="Takeoff Weather" type="text" placeholder="Clear" />
                  <ChecklistItem id="takeoff_1" number={9} label="Request Takeoff - Permission Granted" />
                  <ChecklistItem id="takeoff_time" number={10} label="Takeoff Time" type="text" placeholder="HH:MM" />
                </div>
              </div>

              {/* PRE-LANDING SECTION */}
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-2xl font-black text-cyan-400">PRE-LANDING</h2>
                </div>

                <div className="space-y-2">
                  <ChecklistItem id="prelanding_1" number={1} label="ProCiv Check" />
                  <ChecklistItem id="prelanding_wind" number={2} label="Landing Wind (kt)" type="number" placeholder="0.0" />
                  <ChecklistItem id="prelanding_weather" number={3} label="Landing Weather" type="text" placeholder="Clear" />
                  <ChecklistItem id="prelanding_2" number={4} label="SATCOM OFF" />
                  <ChecklistItem id="prelanding_3" number={5} label="Radar STDBY" />
                  <ChecklistItem id="prelanding_4" number={6} label="Comms Check OK" />
                  <ChecklistItem id="prelanding_5" number={7} label="Aircraft In Sight" />
                  <ChecklistItem id="prelanding_6" number={8} label="Brakes OFF" />
                  <ChecklistItem id="prelanding_7" number={9} label="Lights ON" />
                  <ChecklistItem id="prelanding_8" number={10} label="Permission to Land" />
                  <ChecklistItem id="landing_time" number={11} label="Landing Time" type="text" placeholder="HH:MM" />
                </div>
              </div>

              {/* POST-FLIGHT SECTION */}
              <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-red-600"></div>
                  <h2 className="text-2xl font-black text-red-400">POST-FLIGHT</h2>
                </div>

                <div className="space-y-2">
                  <ChecklistItem id="postflight_fuel" number={1} label="Remaining Fuel (L)" type="number" placeholder="0.0" />
                  <ChecklistItem id="postflight_1" number={2} label="Engine Off" />
                  <ChecklistItem id="postflight_2" number={3} label="EPU Connected" />
                  <ChecklistItem id="postflight_3" number={4} label="Battery Status (<27V)" />
                  <ChecklistItem id="postflight_4" number={5} label="Lights OFF" />
                  <ChecklistItem id="postflight_5" number={6} label="Post Flight Walk-around Begin" />
                  <ChecklistItem id="postflight_6" number={7} label="Stop Mission" />
                  <ChecklistItem id="postflight_7" number={8} label="Video REC Stop" />
                  <ChecklistItem id="postflight_8" number={9} label="Download Data" />
                  <ChecklistItem id="postflight_9" number={10} label="Remote ID OFF" />
                  <ChecklistItem id="postflight_10" number={11} label="Aircraft OFF" />
                  <ChecklistItem id="postflight_11" number={12} label="Post Flight Walk-around Complete" />
                </div>
              </div>

              {/* OBSERVATIONS */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-cyan-400 mb-4">OBSERVATIONS & FAULTS</h2>
                <textarea
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Enter any observations, faults detected, or safety occurrences..."
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded text-white placeholder-slate-500 h-24"
                />
              </div>

              {/* Footer Signature */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">RPIC Signature</label>
                    <div className="border-t-2 border-slate-400 mt-8 pt-2 text-slate-400">_______________________</div>
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Date & Time</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY HH:MM"
                      onChange={(e) => handleInputChange('final_time', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'noc' && (
          <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-12 shadow-2xl text-center text-slate-300">
            <p className="text-xl">Content for {tabs.find((t) => t.id === activeTab)?.label} coming soon...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-red-600/10 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations</p>
      </footer>
    </div>
  );
}
