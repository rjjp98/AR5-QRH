'use client';

import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function NOC() {
  const [activeTab, setActiveTab] = useState('noc');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'checklists', label: 'CHECKLISTS' },
    { id: 'noc', label: 'NOC' },
    { id: 'emergencies', label: 'EMERGENCIES' },
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
      margin: 5,
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
    description = '',
  }: {
    id: string;
    number: number | string;
    label: string;
    type?: 'checkbox' | 'text' | 'number';
    placeholder?: string;
    description?: string;
  }) => (
    <div className="border-b border-slate-700/30 hover:bg-white/5 transition">
      <div className="flex items-center gap-3 py-2 px-3">
        <span className="text-cyan-400 font-bold min-w-[40px] text-sm">{number}</span>
        <span className="text-slate-200 text-sm flex-1">{label}</span>
        {type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={formData[id] || false}
            onChange={(e) => handleInputChange(id, e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-red-500"
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={formData[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className="px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white placeholder-slate-500 text-xs w-24"
          />
        )}
      </div>
      {description && (
        <div className="px-3 pb-2 text-slate-400 text-xs italic">{description}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#000000]" />

      {/* Dynamic glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header */}
      <header className="relative z-40 border-b border-red-600/10 backdrop-blur-md sticky top-0">
        <div className="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <svg width="120" height="30" viewBox="0 0 140 40" className="fill-red-600 drop-shadow-lg">
              <text x="0" y="32" fontSize="28" fontWeight="bold" letterSpacing="2">
                TEKEVER
              </text>
            </svg>
          </div>

          <nav className="flex gap-4 justify-center flex-1">
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

      {/* Content */}
      <div className="relative z-20 mx-auto px-4 py-6">
        {activeTab === 'noc' && (
          <div className="text-white">
            {/* Export Buttons */}
            <div className="mb-6 flex gap-4 sticky top-20 z-30">
              <button
                onClick={exportPDF}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition text-sm"
              >
                📥 EXPORT PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition text-sm"
              >
                🖨️ PRINT
              </button>
            </div>

            <div id="noc-content" className="space-y-6 max-w-4xl mx-auto">
              {/* ========== HEADER SECTION ========== */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-black text-white">AR5 MK3 - NOC</h1>
                  <div className="text-right text-xs text-slate-400">
                    <p>Version: 12</p>
                    <p>Date: 08-Oct-2024</p>
                    <p>Ref: TAS-AR5-ETN-009_00</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Aircraft ID</label>
                    <input type="text" placeholder="#" onChange={(e) => handleInputChange('aircraft_id', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">fGCS ID/Version</label>
                    <input type="text" placeholder="#" onChange={(e) => handleInputChange('fgcs_id', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">mGCS ID/Version</label>
                    <input type="text" placeholder="#" onChange={(e) => handleInputChange('mgcs_id', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Tracker/DL ID</label>
                    <input type="text" placeholder="#" onChange={(e) => handleInputChange('tracker_id', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">SP Control ID</label>
                    <input type="text" placeholder="#" onChange={(e) => handleInputChange('sp_control_id', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mt-3">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Date</label>
                    <input type="date" onChange={(e) => handleInputChange('date', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Location</label>
                    <input type="text" placeholder="Location" onChange={(e) => handleInputChange('location', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Mission Type</label>
                    <input type="text" placeholder="Mission" onChange={(e) => handleInputChange('mission_type', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Night/Day</label>
                    <select onChange={(e) => handleInputChange('night_day', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1">
                      <option>Day</option>
                      <option>Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">RPIC</label>
                    <input type="text" placeholder="Pilot" onChange={(e) => handleInputChange('rpic', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                </div>
              </div>

              {/* ========== FLIGHT RESUME ========== */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-black text-cyan-400 mb-4">FLIGHT RESUME</h2>

                <div className="mb-4">
                  <h3 className="text-sm font-bold text-cyan-300 mb-2">Flight Crew</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder={`Crew ${i} Name`} onChange={(e) => handleInputChange(`crew_${i}_name`, e.target.value)} className="px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white text-xs" />
                        <input type="text" placeholder="Role" onChange={(e) => handleInputChange(`crew_${i}_role`, e.target.value)} className="px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white text-xs" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Takeoff Direction</label>
                    <input type="text" placeholder="Direction" onChange={(e) => handleInputChange('takeoff_direction', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Takeoff Wind</label>
                    <input type="text" placeholder="Wind (kt)" onChange={(e) => handleInputChange('takeoff_wind', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Takeoff Weather</label>
                    <input type="text" placeholder="Weather" onChange={(e) => handleInputChange('takeoff_weather', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Takeoff Weight</label>
                    <input type="text" placeholder="Weight (kg)" onChange={(e) => handleInputChange('takeoff_weight', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-cyan-400 text-xs font-bold">System Configuration</label>
                  <textarea onChange={(e) => handleInputChange('system_config', e.target.value)} placeholder="System configuration details..." className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-16" />
                </div>

                <div className="mt-4">
                  <label className="text-cyan-400 text-xs font-bold">Mission Description / Observations</label>
                  <textarea onChange={(e) => handleInputChange('mission_description', e.target.value)} placeholder="Mission details..." className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-16" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Landing Direction</label>
                    <input type="text" placeholder="Direction" onChange={(e) => handleInputChange('landing_direction', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Landing Wind</label>
                    <input type="text" placeholder="Wind (kt)" onChange={(e) => handleInputChange('landing_wind', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Landing Weather</label>
                    <input type="text" placeholder="Weather" onChange={(e) => handleInputChange('landing_weather', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Landing Weight/Fuel</label>
                    <input type="text" placeholder="Weight (kg)" onChange={(e) => handleInputChange('landing_weight', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-cyan-400 text-xs font-bold">Aircraft Condition</label>
                  <input type="text" placeholder="Aircraft condition..." onChange={(e) => handleInputChange('aircraft_condition', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                </div>

                <div className="mt-4">
                  <label className="text-cyan-400 text-xs font-bold">Faults Detected</label>
                  <textarea onChange={(e) => handleInputChange('faults_detected', e.target.value)} placeholder="Faults..." className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-12" />
                </div>

                <div className="mt-4">
                  <label className="text-cyan-400 text-xs font-bold">Safety Occurrences</label>
                  <textarea onChange={(e) => handleInputChange('safety_occurrences', e.target.value)} placeholder="Safety events..." className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-12" />
                </div>
              </div>

              {/* ========== PRE-FLIGHT SECTION ========== */}
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-lg font-black text-cyan-400">PRE-FLIGHT</h2>
                </div>

                <div className="space-y-0">
                  <ChecklistItem id="pf_0" number="0" label="Daily Briefing / I'M SAFE" description="Conducting the Daily Briefing and the I'M SAFE Procedure" />
                  <ChecklistItem id="pf_1" number="1" label="UAS GEO ZONES (ANAC)" description="Consult https://dnt.anac.pt/mapa.html" />
                  <ChecklistItem id="pf_1b" number="1b" label="Copy.Json file name:" type="text" />
                  <ChecklistItem id="pf_2" number="2" label="ProCiv (Civil Protection)" description="Check no emergency response efforts ongoing" />
                  <ChecklistItem id="pf_3" number="3" label="Consult NOTAM" description="Check active NOTAMs from NAV.pt" />
                  <ChecklistItem id="pf_4" number="4" label="Contact LISBOAMIL" description="Request activation of flight areas" />
                  <ChecklistItem id="pf_4b" number="4b" label="Active flight areas" type="text" />
                  <ChecklistItem id="pf_5" number="5" label="Transponder Code" description="Assigned transponder code" />
                  <ChecklistItem id="pf_5b" number="5b" label="Transponder code" type="text" />
                  <ChecklistItem id="pf_6" number="6" label="Pre-Delivery Inspection" />
                  <ChecklistItem id="pf_6_obs" number="6-obs" label="Observations:" type="text" placeholder="Details" />
                  <ChecklistItem id="pf_7" number="7" label="Remote ID Switch ON" />
                  <ChecklistItem id="pf_8" number="8" label="Data Link & Tracker ON" />
                  <ChecklistItem id="pf_9" number="9" label="Browser Check" description="Check local radio settings" />
                  <ChecklistItem id="pf_10" number="10" label="VPN ON" />
                  <ChecklistItem id="pf_11" number="11" label="AWS Remote Desktop" description="Start all (telemetry and OBC)" />
                  <ChecklistItem id="pf_12" number="12" label="Comms Check" />
                  <ChecklistItem id="pf_13" number="13" label="EPU and Wheel Chocks" description="Check EPU ON and Chocks fitted" />
                  <ChecklistItem id="pf_14" number="14" label="Technician Handover - Aircraft OK" />
                  <ChecklistItem id="pf_14_fuel" number="14-fuel" label="Fuel Quantity (L)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_14_weight" number="14-weight" label="Take Off Weight (kg)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_15" number="15" label="SPC Checklist" description="Complete - Correct Model, Trims, Screen locked" />
                  <ChecklistItem id="pf_15_voltage" number="15-voltage" label="Battery Voltage (V)" type="number" placeholder="27.0" />
                  <ChecklistItem id="pf_16" number="16" label="Aircraft Level" description="±5° pitch, ±5° roll" />
                  <ChecklistItem id="pf_17" number="17" label="Pitot Cover Fitted" />
                  <ChecklistItem id="pf_18" number="18" label="Aircraft ON" description="Critical & Non-Critical" />
                  <ChecklistItem id="pf_19" number="19" label="System Initializing" description="Wait 30 seconds" />
                  <ChecklistItem id="pf_20" number="20" label="Initialization Complete" />
                </div>
              </div>

              {/* ========== SENSOR CHECKS ========== */}
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-lg font-black text-cyan-400">SENSOR CHECKS & SYSTEMS</h2>
                </div>

                <div className="space-y-0">
                  <ChecklistItem id="pf_21" number="21" label="Flight GCS" description="Show config editor / load / start selected" />
                  <ChecklistItem id="pf_22" number="22" label="Mode Manual" />
                  <ChecklistItem id="pf_23" number="23" label="SPC Ignition Test" description="Turn OFF and back ON, Check OFF in GCS" />
                  <ChecklistItem id="pf_24" number="24" label="Ignition ON" />
                  <ChecklistItem id="pf_25" number="25" label="Throttle %" type="number" placeholder="<10" />
                  <ChecklistItem id="pf_26" number="26" label="Accelerometer (EMI check)" description="Range: -100:100, max diff 50" />
                  <ChecklistItem id="pf_27" number="27" label="Gyro (EMI check)" description="Range: -100:100" />
                  <ChecklistItem id="pf_28" number="28" label="Battery Voltage GPU" description=">24500 V (Critical & Non-critical)" />
                  <ChecklistItem id="pf_28_v" number="28-v" label="Voltage (V)" type="number" placeholder="24500" />
                  <ChecklistItem id="pf_29" number="29" label="GPS1 (EMI check)" description="Hdop<1, 3DFix & sat>14" />
                  <ChecklistItem id="pf_30" number="30" label="GPS2 (EMI check)" description="Hdop<1, 3DFix & sat>14" />
                  <ChecklistItem id="pf_31" number="31" label="SPC Range Check" description="Clear to perform range check" />
                  <ChecklistItem id="pf_32" number="32" label="Throttle Failsafe" description="Check autopilot messages" />
                  <ChecklistItem id="pf_33" number="33" label="Magnetometer" description="Check coherent X, Y, Z" />
                  <ChecklistItem id="pf_34" number="34" label="SPC" description="Confirm RC OFF and ON, Screen locked" />
                  <ChecklistItem id="pf_35" number="35" label="Satcom Service" />
                  <ChecklistItem id="pf_36" number="36" label="RLOS (EMI check)" description="OK (100%) & RSSI>-15" />
                  <ChecklistItem id="pf_37" number="37" label="RLOS-B" description="OK (100%)" />
                  <ChecklistItem id="pf_38" number="38" label="4G" description="OK (100%)" />
                  <ChecklistItem id="pf_39" number="39" label="RSSI Graph" description="Check ok" />
                  <ChecklistItem id="pf_40" number="40" label="SATCOM IRU + Router" />
                  <ChecklistItem id="pf_41" number="41" label="Payload" description="Payload ON" />
                  <ChecklistItem id="pf_42" number="42" label="ATLAS" description="Start mission exporter stream" />
                  <ChecklistItem id="pf_43" number="43" label="Radar" description="ON & Standby mode" />
                  <ChecklistItem id="pf_44" number="44" label="SATCOM-B" description="100%" />
                  <ChecklistItem id="pf_45" number="45" label="Remaining fuel (sensor)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_46" number="46" label="Initial fuel level" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_47" number="47" label="Parameters Refresh" />
                  <ChecklistItem id="pf_48" number="48" label="GROUND_STEER_ALT" description="VALUE 5" />
                  <ChecklistItem id="pf_49" number="49" label="ALT_HOLD_RTL" description="VALUE -1" />
                  <ChecklistItem id="pf_50" number="50" label="TRIM_ARSPD_CM" description="2700 <150kg | 2800 >150kg | 2900 >165kg" />
                  <ChecklistItem id="pf_51" number="51" label="ARSPD_PRIMARY" description="VALUE 0" />
                  <ChecklistItem id="pf_52" number="52" label="Airspeed" description="0<VALUE<10" />
                  <ChecklistItem id="pf_53" number="53" label="Barometer (mBar)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_54" number="54" label="Lidar distance" description="Check value>0 within ]0:3]" />
                  <ChecklistItem id="pf_55" number="55" label="Mode FBWA Change" />
                  <ChecklistItem id="pf_56" number="56" label="Roll Left" description="Check Left Aileron Down / Right Aileron Up" />
                  <ChecklistItem id="pf_57" number="57" label="Pitch Up" description="Check Elevators Down / Instruments" />
                  <ChecklistItem id="pf_58" number="58" label="Roll Right" description="Check Left Aileron Up/ Right Aileron Down" />
                  <ChecklistItem id="pf_59" number="59" label="Pitot Remove cover" />
                  <ChecklistItem id="pf_60" number="60" label="Airspeed 1 Test (EMI check)" description="Elevator Up / Airspeed1 alive" />
                  <ChecklistItem id="pf_61" number="61" label="Airspeed 2 Test (EMI check)" description="Airspeed2 alive" />
                  <ChecklistItem id="pf_62" number="62" label="Airspeed 3 Test (EMI check)" description="Airspeed3 alive" />
                  <ChecklistItem id="pf_63" number="63" label="Mode Manual Change" />
                  <ChecklistItem id="pf_64" number="64" label="Weather Conditions" description="Fill engine start column of hourly log" />
                  <ChecklistItem id="pf_65" number="65" label="Maximum takeoff headwind" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_66" number="66" label="Maximum takeoff crosswind" type="number" placeholder="0.0" />
                  <ChecklistItem id="pf_67" number="67" label="Runway" description="Check runway for departure" />
                  <ChecklistItem id="pf_68" number="68" label="Load Areas" description="Load NOTAM & Operational Areas" />
                  <ChecklistItem id="pf_69" number="69" label="Routes" description="Read / Load / Write - Mission Loaded" />
                </div>
              </div>

              {/* ========== ENGINE START ========== */}
              <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600"></div>
                  <h2 className="text-lg font-black text-red-400">ENGINE START & TAKEOFF</h2>
                </div>

                <div className="space-y-0">
                  <ChecklistItem id="es_70" number="70" label="Navigation Lights" />
                  <ChecklistItem id="es_71" number="71" label="Strobe Lights" />
                  <ChecklistItem id="es_72" number="72" label="Landing Lights" description="ON & OFF" />
                  <ChecklistItem id="es_73" number="73" label="Transponder" description="ON & Standby mode" />
                  <ChecklistItem id="es_74" number="74" label="Request Startup" description="Permission Granted" />
                  <ChecklistItem id="es_75" number="75" label="EPU Remove" description="EPU / Close Hatch" />
                  <ChecklistItem id="es_76" number="76" label="Throttle Idle" />
                  <ChecklistItem id="es_77" number="77" label="Ignition ON" />
                  <ChecklistItem id="es_78" number="78" label="Brakes ON" />
                  <ChecklistItem id="es_79" number="79" label="Startup #1 & #2" type="text" placeholder="HH:MM" />
                  <ChecklistItem id="es_80" number="80" label="Engine Warm Up" description="Approx. 2000 RPM" />
                  <ChecklistItem id="es_81" number="81" label="Engine Status" description="Check Engine Sensors Alive and Plausible" />
                  <ChecklistItem id="es_82" number="82" label="Engine Temperature" description="Check >=100°C #1 & #2" />
                  <ChecklistItem id="es_83" number="83" label="Ignition tests @3000rpm" description="CDI 1,2,3,4 OFF/ON" />
                  <ChecklistItem id="es_84" number="84" label="Engine Max RPM Test" description="(check>5200RPM) 5 Seconds" />
                  <ChecklistItem id="es_85" number="85" label="Battery Status" description="Check Generator & voltage > 27V" />
                  <ChecklistItem id="es_86" number="86" label="Payload Checklist" />
                  <ChecklistItem id="es_87" number="87" label="Request Taxi" description="Permission Granted" />
                  <ChecklistItem id="es_88" number="88" label="Wheel Chocks Removed" />
                  <ChecklistItem id="es_89" number="89" label="Taxi Clear" />
                  <ChecklistItem id="es_90" number="90" label="Check Controls" description="Manual and FBWA" />
                  <ChecklistItem id="es_91" number="91" label="Check Brakes" description="Manual and FBWA" />
                  <ChecklistItem id="es_92" number="92" label="Check Steering" description="Manual and FBWA" />
                  <ChecklistItem id="es_93" number="93" label="Tracker" description="Tracking Aircraft Correctly" />
                  <ChecklistItem id="es_94" number="94" label="Stop on Runway" description="Set Home Altitude & Set Home Position" />
                  <ChecklistItem id="es_95" number="95" label="Route" description="Check route altitudes and write to aircraft" />
                  <ChecklistItem id="es_96" number="96" label="GCS Warnings" description="Waypoint ON, Mode ON, Comms ON, Motor Set ON 1000rpm" />
                  <ChecklistItem id="es_97" number="97" label="General Status Check" />
                  <ChecklistItem id="es_98" number="98" label="Transponder" description="ON & Mode ACS" />
                  <ChecklistItem id="es_99" number="99" label="Crew Clear" />
                  <ChecklistItem id="es_100" number="100" label="Commander Clear" />
                  <ChecklistItem id="es_101" number="101" label="Request Take-off" description="Permission Granted" />
                  <ChecklistItem id="es_102" number="102" label="Time info panel Start Mission" />
                  <ChecklistItem id="es_103" number="103" label="Engines Clear" />
                  <ChecklistItem id="es_104" number="104" label="Take-off Time" type="text" placeholder="HH:MM" />
                  <ChecklistItem id="es_105" number="105" label="Take-off Complete" description="General Status OK" />
                  <ChecklistItem id="es_106" number="106" label="Transit Corridor Payload SURVEY" description="Use GIMBAL optical sensor" />
                  <ChecklistItem id="es_107" number="107" label="Change THR_MIN to 30%" />
                  <ChecklistItem id="es_108" number="108" label="SATCOM & Radar On" description="Radar, Satcom VMBR + ACU" />
                  <ChecklistItem id="es_109" number="109" label="Browser Check Satcom" description="IP 192.168.0.1" />
                  <ChecklistItem id="es_110" number="110" label="GCS Warnings" description="Battery Set ON 24V, Altitude ON (min:200ft)" />
                  <ChecklistItem id="es_111" number="111" label="Ground Steer" description="Set GROUND_STEER_ALT = 0" />
                  <ChecklistItem id="es_112" number="112" label="SPC Off" />
                  <ChecklistItem id="es_113" number="113" label="Rally points" description="Set Rally points" />
                </div>
              </div>

              {/* ========== PRE-LANDING ========== */}
              <div className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                  <h2 className="text-lg font-black text-cyan-400">PRE-LANDING</h2>
                </div>

                <div className="space-y-0">
                  <ChecklistItem id="pl_1" number="1" label="ProCiv (Civil Protection)" description="Check no emergency response efforts" />
                  <ChecklistItem id="pl_2" number="2" label="Check loiter direction" description="CW or CCW" />
                  <ChecklistItem id="pl_3" number="3" label="SATCOM OFF" description="Satcom VMBR + ACU" />
                  <ChecklistItem id="pl_4" number="4" label="Change THR_MIN to 0%" />
                  <ChecklistItem id="pl_5" number="5" label="Ground Steer" description="Set GROUND_STEER_ALT = 5" />
                  <ChecklistItem id="pl_6" number="6" label="TRIM_ARSPD_CM" description="Check value and landing weight" />
                  <ChecklistItem id="pl_7" number="7" label="Radar STDBY" />
                  <ChecklistItem id="pl_8" number="8" label="Comms Check" />
                  <ChecklistItem id="pl_9" number="9" label="Aircraft In Sight" />
                  <ChecklistItem id="pl_10" number="10" label="SPC Checklist" description="OK & ON" />
                  <ChecklistItem id="pl_11" number="11" label="Brakes OFF" />
                  <ChecklistItem id="pl_12" number="12" label="Lights ON" />
                  <ChecklistItem id="pl_13" number="13" label="Gimbal" description="Check landing gear & protect" />
                  <ChecklistItem id="pl_14" number="14" label="Clearance" description="Permission to land" />
                  <ChecklistItem id="pl_15" number="15" label="GCS Warnings" description="Set Altitude Warning OFF" />
                  <ChecklistItem id="pl_16" number="16" label="Landing Time" type="text" placeholder="HH:MM" />
                  <ChecklistItem id="pl_17" number="17" label="Vacate Runway" description="Runway vacated" />
                  <ChecklistItem id="pl_18" number="18" label="Strobes OFF" />
                  <ChecklistItem id="pl_19" number="19" label="Request taxi" description="Permission granted" />
                  <ChecklistItem id="pl_20" number="20" label="Satcom service OFF" />
                  <ChecklistItem id="pl_21" number="21" label="Transponder" description="Set Standby then OFF" />
                  <ChecklistItem id="pl_22" number="22" label="Engine Off Time" type="text" placeholder="HH:MM" />
                </div>
              </div>

              {/* ========== POST-FLIGHT ========== */}
              <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600"></div>
                  <h2 className="text-lg font-black text-red-400">POST-FLIGHT</h2>
                </div>

                <div className="space-y-0">
                  <ChecklistItem id="pof_23" number="23" label="Remaining fuel (sensor)" type="number" placeholder="0.0" />
                  <ChecklistItem id="pof_24" number="24" label="Remaining fuel (integrated)" />
                  <ChecklistItem id="pof_25" number="25" label="EPU Connected" />
                  <ChecklistItem id="pof_26" number="26" label="Battery status" description="Check external and <27V" />
                  <ChecklistItem id="pof_27" number="27" label="Lights" description="Nav and land OFF" />
                  <ChecklistItem id="pof_28" number="28" label="Post Flight Walk-around Begin" />
                  <ChecklistItem id="pof_29" number="29" label="Time info panel Stop Mission" />
                  <ChecklistItem id="pof_30" number="30" label="Deactivate areas and return transponder code (LISBOAMIL)" />
                  <ChecklistItem id="pof_31" number="31" label="Video REC Stop" />
                  <ChecklistItem id="pof_32" number="32" label="ATLAS Download Report" />
                  <ChecklistItem id="pof_33" number="33" label="Radar ON" />
                  <ChecklistItem id="pof_34" number="34" label="Download Data" description="Gimbal & Radar" />
                  <ChecklistItem id="pof_35" number="35" label="Comms Manager Shutdown" />
                  <ChecklistItem id="pof_36" number="36" label="Post Flight Walk-around Complete" />
                  <ChecklistItem id="pof_37" number="37" label="Remote ID OFF" />
                  <ChecklistItem id="pof_38" number="38" label="Aircraft OFF" description="Critical & Non-Critical" />
                </div>
              </div>

              {/* ========== FLIGHT CHECKS HOURLY ========== */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl overflow-x-auto">
                <h2 className="text-lg font-black text-cyan-400 mb-4">FLIGHT CHECKS (HOURLY)</h2>
                <table className="w-full text-xs text-white border-collapse">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="border border-slate-600 p-2 text-left">Flight Time (h)</th>
                      <th className="border border-slate-600 p-2">Engine Start</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <th key={i} className="border border-slate-600 p-2">{i}</th>
                      ))}
                      <th className="border border-slate-600 p-2">Land</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Schedule (hh:mm)', key: 'schedule' },
                      { label: 'Fuel Log complete', key: 'fuel_log' },
                      { label: 'Outside temperature', key: 'temp' },
                      { label: 'Icing condition', key: 'icing' },
                      { label: 'Rain', key: 'rain' },
                      { label: 'Wind', key: 'wind' },
                      { label: 'Engine status RPM', key: 'engine_rpm' },
                      { label: 'Engine status TPS', key: 'engine_tps' },
                      { label: 'Engine status temp', key: 'engine_temp' },
                      { label: 'Battery status', key: 'battery' },
                      { label: 'Aircraft mass', key: 'mass' },
                      { label: 'Check UAS Geozones', key: 'geozones' },
                      { label: 'Check ProCiv', key: 'prociv' },
                    ].map((row) => (
                      <tr key={row.key}>
                        <td className="border border-slate-600 p-2 text-left font-bold">{row.label}</td>
                        {['start', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'land'].map((col) => (
                          <td key={col} className="border border-slate-600 p-1">
                            <input
                              type="text"
                              onChange={(e) => handleInputChange(`hourly_${row.key}_${col}`, e.target.value)}
                              className="w-full px-1 py-1 bg-white/10 border border-cyan-500/30 rounded text-white text-xs"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ========== PILOT HANDOVER ========== */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                <h2 className="text-lg font-black text-cyan-400 mb-4">PILOT HANDOVER</h2>

                <div className="space-y-6">
                  {[1, 2, 3].map((handover) => (
                    <div key={handover} className="border-t border-slate-600 pt-4">
                      <h3 className="text-sm font-bold text-cyan-300 mb-3">Handover #{handover}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Mission Details</label>
                          <textarea onChange={(e) => handleInputChange(`handover_${handover}_mission`, e.target.value)} placeholder="Callsign / Airspace / Objective / MET / RTB Time" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-12" />
                        </div>
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Airspace Active</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_airspace`, e.target.value)} placeholder="Airspace details" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Aircraft Status</label>
                          <textarea onChange={(e) => handleInputChange(`handover_${handover}_status`, e.target.value)} placeholder="System Config / Engine / Fuel & Bingo / Limitations" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white text-xs h-12" />
                        </div>
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Communication Status</label>
                          <textarea onChange={(e) => handleInputChange(`handover_${handover}_comms`, e.target.value)} placeholder="Datalinks / AWS / LOS Range / Serviceability" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white text-xs h-12" />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Handling Pilot</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_handling_pilot`, e.target.value)} placeholder="Name" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Relieving Pilot</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_relieving_pilot`, e.target.value)} placeholder="Name" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">MxC / RPIC</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_mxc_rpic`, e.target.value)} placeholder="Name" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Time of Change</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_time`, e.target.value)} placeholder="HH:MM" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                        <div>
                          <label className="text-cyan-400 text-xs font-bold">Remarks</label>
                          <input type="text" onChange={(e) => handleInputChange(`handover_${handover}_remarks`, e.target.value)} placeholder="Remarks" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========== OBSERVATIONS & SIGNATURE ========== */}
              <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Date</label>
                    <input type="date" onChange={(e) => handleInputChange('final_date', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Time</label>
                    <input type="time" onChange={(e) => handleInputChange('final_time', e.target.value)} className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-cyan-400 text-xs font-bold">Observations</label>
                  <textarea onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Final observations and notes..." className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white text-xs h-16" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">RPIC</label>
                    <input type="text" onChange={(e) => handleInputChange('final_rpic', e.target.value)} placeholder="Print Name" className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs" />
                    <div className="border-t border-slate-400 mt-4 pt-2 text-slate-400 text-xs">_________________</div>
                  </div>
                  <div>
                    <label className="text-cyan-400 text-xs font-bold">Sign</label>
                    <div className="border-b-2 border-slate-400 mt-6 h-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'noc' && (
          <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-12 shadow-2xl text-center text-slate-300">
            <p className="text-xl">Coming soon...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-red-600/10 mt-10 py-6 text-center text-slate-600 text-xs">
        <p>AR5 MK3 NOC © 2026 | Tekever Flight Operations | Confidential</p>
      </footer>
    </div>
  );
}
