'use client';

import { useState, useEffect } from 'react';

interface ChecklistItem {
  number: number;
  label: string;
  description?: string;
  type: 'checkbox' | 'text' | 'number' | 'table-cell';
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

interface ChecklistTemplate {
  id: string;
  name: string;
  sections: ChecklistSection[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('checklist');
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isClient, setIsClient] = useState(false);

  // Complete NOC Checklist Template - EXATAMENTE COMO NO PDF
  const nocTemplate: ChecklistTemplate = {
    id: 'noc',
    name: 'NOC - Normal Operations Checklist',
    sections: [
      {
        title: 'Flight Resume',
        items: [
          { number: 0, label: 'Aircraft ID', type: 'text' },
          { number: 1, label: 'iGCS ID/Version', type: 'text' },
          { number: 2, label: 'mGCS ID/Version', type: 'text' },
          { number: 3, label: 'Tracker / DL ID', type: 'text' },
          { number: 4, label: 'SF Control ID', type: 'text' },
          { number: 5, label: 'Date', type: 'text' },
          { number: 6, label: 'Location', type: 'text' },
          { number: 7, label: 'Mission type', type: 'text' },
          { number: 8, label: 'Night / Day', type: 'text' },
          { number: 9, label: 'RPIC', type: 'text' },
        ],
      },
      {
        title: 'Pre-Flight',
        items: [
          { number: 0, label: 'Daily Briefing / I&apos;M SAFE', description: 'Conducting the Daily Briefing and the I&apos;M SAFE Procedure', type: 'checkbox' },
          { number: 1, label: 'UAS GEO ZONES (ANAC)', description: 'Consult to check that there are no conflict areas https://dnt.anac.pt/mapa.html Copy Json file name:', type: 'text' },
          { number: 2, label: 'ProCiv (Civil Protection)', description: 'Consult to check that there are no emergency response efforts ongoing inside flight areas', type: 'checkbox' },
          { number: 3, label: 'Consult NOTAM', description: 'Consult active NOTAM&apos;s from NAV.pt', type: 'checkbox' },
          { number: 4, label: 'NOTAM AIRSPACE', description: 'Consult if AIRSPACE to request the activation of flight areas Active flight areas Assigned transponder code', type: 'text' },
          { number: 5, label: 'Transponder', description: 'When activating Areas or Corridors request the assignment of a specific transponder code', type: 'text' },
          { number: 6, label: 'Pre-Delivery Inspection', description: 'Complete Observations:', type: 'text' },
          { number: 7, label: 'Remote ID', description: 'Switch ON. Check that everything is OK.', type: 'checkbox' },
          { number: 8, label: 'Data Link &amp; Tracker', type: 'checkbox' },
          { number: 9, label: 'Browser', description: 'Check local radio settings', type: 'checkbox' },
          { number: 10, label: 'VPN', description: 'ON', type: 'checkbox' },
          { number: 11, label: 'AWS Remote Desktop', description: 'Start all (telemetry and GCS)', type: 'checkbox' },
          { number: 12, label: 'Coms Check', description: 'OK', type: 'checkbox' },
          { number: 13, label: 'EPU and Wheel Chocks', description: 'Check EPU ON and Chocks fitted Aircraft OK', type: 'checkbox' },
          { number: 14, label: 'Technician Handover', description: 'Fuel Quantity. Ask MT &amp; Log Take Off Weight. Ask MT &amp; Log', type: 'text' },
          { number: 15, label: 'SPC Checklist', description: 'Complete Correct Model, Trims, Screen locked, battery voltage', type: 'text' },
          { number: 16, label: 'Aircraft Level', description: '+- 5 degrees pitch +5 degrees roll', type: 'checkbox' },
          { number: 17, label: 'Pilot Cover', description: 'Fitted', type: 'checkbox' },
          { number: 18, label: 'Aircraft ON', description: 'Critical &amp; Non-Critical', type: 'checkbox' },
          { number: 19, label: 'System Initializing', description: 'Wait 30 seconds', type: 'checkbox' },
          { number: 20, label: 'Initialization', description: 'Complete', type: 'checkbox' },
          { number: 21, label: 'Flight GCS', description: 'Show config editor / load / start selected', type: 'checkbox' },
          { number: 22, label: 'Mode', description: 'Manual', type: 'checkbox' },
          { number: 23, label: 'SPC Ignition Test', description: 'Turn OFF and back ON, Check OFF in GCS', type: 'checkbox' },
          { number: 24, label: 'Ignition', description: 'Ignition ON', type: 'checkbox' },
          { number: 25, label: 'Throttle %', description: '&lt;10%', type: 'checkbox' },
        ],
      },
      {
        title: 'Engine &amp; Systems Check',
        items: [
          { number: 26, label: 'Accelerometer (EMI check)', description: 'AR5imu1 Acc X and AR5imu2 Acc X (-100-100, max diff. 50) AR5imu1 Acc Y and AR5imu2 Acc Y (-100-100, max diff. 50) AR5imu1 Acc Z and AR5imu2 Acc Z (-1080-880)', type: 'checkbox' },
          { number: 27, label: 'Gyro (EMI check)', description: 'AR5imu1 Gyro X and AR5imu2 Gyro X (-100-100) AR5imu1 Gyro Y and AR5imu2 Gyro Y (-100-100) AR5imu1 Gyro Z and AR5imu2 Gyro Z (-100-100)', type: 'checkbox' },
          { number: 28, label: 'Battery Voltage', description: 'GPU Critical battery voltage &gt; 24500 GPU NON critical battery voltage &gt; 24500', type: 'checkbox' },
          { number: 29, label: 'GPS1 (EMI check)', description: 'Hdop&lt;1, 3DFix &amp; sat&gt;14', type: 'checkbox' },
          { number: 30, label: 'GPS2 (EMI check)', description: 'Hdop&lt;1, 3DFix &amp; sat&gt;14', type: 'checkbox' },
          { number: 31, label: 'SPC Range Check', description: 'Clear to perform range check', type: 'checkbox' },
          { number: 32, label: 'Throttle Failsafe', description: 'Check autopilot messages', type: 'checkbox' },
          { number: 33, label: 'Magnetometer', description: 'Run graph AR5imu1 Mag X and AR5imu2 Mag X and check coherent Run graph AR5imu1 Mag Y and AR5imu2 Mag Y and check coherent Run graph AR5imu1 Mag Z and AR5imu2 Mag Z and check coherent', type: 'checkbox' },
          { number: 34, label: 'SPC', description: 'Confirm RC OFF and ON accordingly Confirm screen locked', type: 'checkbox' },
          { number: 35, label: 'Satcom Service', description: 'ON', type: 'checkbox' },
          { number: 36, label: 'RLOS (EMI check)', description: 'OK (100%) &amp; RSSI&gt;-15', type: 'checkbox' },
          { number: 37, label: 'RLOS-B', description: 'OK (100%)', type: 'checkbox' },
          { number: 38, label: '4G', description: 'OK (100%)', type: 'checkbox' },
          { number: 39, label: 'RSSI Graph', description: 'Check ok', type: 'checkbox' },
          { number: 40, label: 'SATCOM IRU + Router', description: 'ON', type: 'checkbox' },
          { number: 41, label: 'Payload', description: 'Payload ON', type: 'checkbox' },
          { number: 42, label: 'ATLAS', description: 'Start mission exporter stream and create mission on ATLAS', type: 'checkbox' },
          { number: 43, label: 'Radar', description: 'ON &amp; Standby mode', type: 'checkbox' },
          { number: 44, label: 'SATCOM-B', description: '100%', type: 'checkbox' },
          { number: 45, label: 'Remaining fuel (sensor)', description: 'Check and Log value', type: 'text' },
          { number: 46, label: 'Initial fuel level', description: 'Input &amp; Log value', type: 'text' },
          { number: 47, label: 'Parameters', description: 'Refresh', type: 'checkbox' },
          { number: 48, label: 'GROUND_STEER_ALT', description: 'VALUE 5', type: 'checkbox' },
          { number: 49, label: 'ALT_HOLD_RTL', description: 'VALUE -1 VALUE: 2700 &lt;150kg 2800 &gt;150kg', type: 'text' },
          { number: 50, label: 'TRIM_ARSPD_CM', description: '2900 &gt;165kg', type: 'text' },
          { number: 51, label: 'ARSPD_PRIMARY', description: 'VALUE 0', type: 'checkbox' },
          { number: 52, label: 'Airspeed', description: 'D&lt;VALUE&lt;10', type: 'checkbox' },
          { number: 53, label: 'Barometer', description: 'Value= mBar', type: 'text' },
        ],
      },
      {
        title: 'Takeoff Preparation',
        items: [
          { number: 54, label: 'Lidar distance', description: 'Start graph, Check value&gt;0 and within [0 : 3 ]', type: 'checkbox' },
          { number: 55, label: 'Mode FBWA', description: 'Change', type: 'checkbox' },
          { number: 56, label: 'Roll Left', description: 'Check Left Aileron Down / Right Aileron Up / Lidar Increase / Instruments', type: 'checkbox' },
          { number: 57, label: 'Pitch Up', description: 'Check Elevators Down / Instruments', type: 'checkbox' },
          { number: 58, label: 'Roll Right', description: 'Check Left Aileron Up/ Right Aileron Down/ Lidar Increase / Instruments', type: 'checkbox' },
          { number: 59, label: 'Pilot', description: 'Remove cover', type: 'checkbox' },
          { number: 60, label: 'Airspeed 1 Test (EMI check)', description: 'Elevator Up / Airspeed1 alive', type: 'checkbox' },
          { number: 61, label: 'Airspeed 2 Test (EMI check)', description: 'Airspeed2 alive', type: 'checkbox' },
          { number: 62, label: 'Airspeed 3 Test (EMI check)', description: 'Airspeed3 alive', type: 'checkbox' },
          { number: 63, label: 'Mode Manual', description: 'Change', type: 'checkbox' },
          { number: 64, label: 'Weather Conditions', description: 'Check and fill &apos;engine start&apos; column of hourly log table', type: 'checkbox' },
          { number: 65, label: 'Maximum take-off headwind', description: 'Check limits Register value &gt;&gt;', type: 'text' },
          { number: 66, label: 'Maximum take-off crosswind', description: 'Check limits Register value &gt;&gt;', type: 'text' },
          { number: 67, label: 'Runway', description: 'Check runway for departure', type: 'checkbox' },
          { number: 68, label: 'Load Areas', description: 'Load NOTAM &amp; Operational Areas Mission Loaded Prepare Take-Off Set', type: 'checkbox' },
          { number: 69, label: 'Routes', description: 'Read If needed Load Write Read Prepare Landing Set LANDING Waypoint Set Check loaded Rally points', type: 'checkbox' },
          { number: 70, label: 'Navigation Lights', description: 'ON', type: 'checkbox' },
          { number: 71, label: 'Strobe lights', description: 'ON', type: 'checkbox' },
          { number: 72, label: 'Landing Lights', description: 'ON &amp; OFF', type: 'checkbox' },
          { number: 73, label: 'Transponder', description: 'ON &amp; Standby mode', type: 'checkbox' },
          { number: 74, label: 'Request Startup', description: 'Permission Granted', type: 'checkbox' },
          { number: 75, label: 'EPU', description: 'Remove EPU / Close Hatch', type: 'checkbox' },
          { number: 76, label: 'Throttle', description: 'Idle', type: 'checkbox' },
          { number: 77, label: 'Ignition', description: 'ON', type: 'checkbox' },
          { number: 78, label: 'Brakes', description: 'ON', type: 'checkbox' },
          { number: 79, label: 'Startup #1 &amp; #2', description: 'Time: ___:___', type: 'text' },
        ],
      },
      {
        title: 'Engine Warm Up &amp; Takeoff',
        items: [
          { number: 80, label: 'Engine Warm Up', description: 'Approx. 2000RPM', type: 'checkbox' },
          { number: 81, label: 'Engine Status', description: 'Check Engine Sensors Alive and Plausible', type: 'checkbox' },
          { number: 82, label: 'Engine Temperature', description: 'Check &gt;=100ºC #1 &amp; #2', type: 'checkbox' },
          { number: 83, label: 'Ignition tests @3000rpm', description: 'CDI 1 OFF Check TPS increase, 3000rpm CDI 1 ON Check TPS decrease, 3000rpm CDI 3 OFF Check TPS increase, 3000rpm CDI 3 ON Check TPS decrease, 3000rpm CDI 2 OFF Check TPS increase, 3000rpm CDI 2 ON Check TPS decrease, 3000rpm CDI 4 OFF Check TPS increase, 3000rpm CDI 4 ON Check TPS decrease, 3000rpm', type: 'checkbox' },
          { number: 84, label: 'Engine Max RPM Test (5 Seconds)', description: '(check&gt;5200RPM) Max RPM #1 (check&gt;5200RPM) Max RPM #2', type: 'text' },
          { number: 85, label: 'Battery Status', description: 'Check Generator &amp; voltage &gt; 27V Complete', type: 'checkbox' },
          { number: 86, label: 'Payload Checklist', description: 'Observations:', type: 'text' },
          { number: 87, label: 'Request Taxi', description: 'Permission Granted', type: 'checkbox' },
          { number: 88, label: 'Wheel Checks', description: 'Removed', type: 'checkbox' },
          { number: 89, label: 'Taxi', description: 'Clear Taxi', type: 'checkbox' },
          { number: 90, label: 'Check Controls', description: 'Manual and FBWA', type: 'checkbox' },
          { number: 91, label: 'Check Brakes', description: 'Manual and FBWA', type: 'checkbox' },
          { number: 92, label: 'Check Steering', description: 'Manual and FBWA', type: 'checkbox' },
          { number: 93, label: 'Tracker', description: 'Tracking Aircraft Correctly', type: 'checkbox' },
          { number: 94, label: 'Stop on Runway', description: 'Set Home Altitude &amp; Set Home Position', type: 'checkbox' },
          { number: 95, label: 'Route', description: 'Check route altitudes and write to aircraft', type: 'checkbox' },
          { number: 96, label: 'GCS Warnings', description: 'Waypoint ON, Mode ON, Comms ON, Motor Set ON 1000rpm', type: 'checkbox' },
          { number: 97, label: 'General Status', description: 'Check', type: 'checkbox' },
          { number: 98, label: 'Transponder', description: 'ON &amp; Mode ACS', type: 'checkbox' },
          { number: 99, label: 'Crew', description: 'Clear', type: 'checkbox' },
          { number: 100, label: 'Commander', description: 'Clear', type: 'checkbox' },
          { number: 101, label: 'Request Take-off', description: 'Permission Granted', type: 'checkbox' },
          { number: 102, label: 'Time info panel', description: 'Start Mission', type: 'checkbox' },
          { number: 103, label: 'Engines', description: 'Clear Engines', type: 'checkbox' },
          { number: 104, label: 'Take-off', description: 'Time: ___:___', type: 'text' },
          { number: 105, label: 'Take-off Complete', description: 'General Status OK', type: 'checkbox' },
          { number: 106, label: 'Transit Corridor Payload SURVEY', description: 'Use GIMBAL optical sensor to search for gatherings of people, along the transit corridor. Record and store the footage', type: 'checkbox' },
        ],
      },
      {
        title: 'In-Flight Operations',
        items: [
          { number: 107, label: 'Change THR_MIN', description: 'Change THR_MIN to 30%', type: 'checkbox' },
          { number: 108, label: 'SATCOM &amp; Radar On', description: 'Radar, Satcom VMBR + ACU', type: 'checkbox' },
          { number: 109, label: 'Browser', description: 'Check Satcom (IP 192.168.0.1)', type: 'checkbox' },
          { number: 110, label: 'GCS Warnings', description: 'Battery Set ON 24V, Set Altitude Warning ON (min:200ft)', type: 'checkbox' },
          { number: 111, label: 'Ground Steer', description: 'Set GROUND_STEER_ALT = 0', type: 'checkbox' },
          { number: 112, label: 'SPC', description: 'Off', type: 'checkbox' },
          { number: 113, label: 'Rally points', description: 'Set Rally points', type: 'checkbox' },
        ],
      },
      {
        title: 'Pre-Landing',
        items: [
          { number: 1, label: 'ProCiv (Civil Protection)', description: 'Consult to check that there are no emergency response efforts ongoing inside flight areas', type: 'checkbox' },
          { number: 2, label: 'Check loiter direction', description: '(CW or CCW)', type: 'checkbox' },
          { number: 3, label: 'SATCOM OFF', description: 'Satcom VMBR + ACU', type: 'checkbox' },
          { number: 4, label: 'Change THR_MIN', description: 'Change THR_MIN to 0%', type: 'checkbox' },
          { number: 5, label: 'Ground Steer', description: 'Set GROUND_STEER_ALT = 0', type: 'checkbox' },
          { number: 6, label: 'TRIM_ARSPD_CM', description: 'Check value and landing weight', type: 'checkbox' },
          { number: 7, label: 'Radar', description: 'STDBY', type: 'checkbox' },
          { number: 8, label: 'Coms Check', description: 'OK', type: 'checkbox' },
          { number: 9, label: 'Aircraft', description: 'In Sight', type: 'checkbox' },
          { number: 10, label: 'SPC Checklist', description: 'OK &amp; ON', type: 'checkbox' },
          { number: 11, label: 'Brakes', description: 'OFF', type: 'checkbox' },
          { number: 12, label: 'Lights', description: 'ON', type: 'checkbox' },
          { number: 13, label: 'Gimbal', description: 'Check landing gear &amp; protect', type: 'checkbox' },
          { number: 14, label: 'Clearance', description: 'Permission to land', type: 'checkbox' },
          { number: 15, label: 'GCS Warnings', description: 'Set Altitude Warning OFF', type: 'checkbox' },
          { number: 16, label: 'Landing', description: 'Time: ___:___', type: 'text' },
          { number: 17, label: 'Vacate', description: 'Runway vacated', type: 'checkbox' },
          { number: 18, label: 'Strobes', description: 'OFF', type: 'checkbox' },
          { number: 19, label: 'Request taxi', description: 'Permission granted', type: 'checkbox' },
          { number: 20, label: 'Satcom service', description: 'OFF', type: 'checkbox' },
          { number: 21, label: 'Transponder', description: 'Set Standby then switch OFF', type: 'checkbox' },
          { number: 22, label: 'Engine Off', description: 'Time: ___:___', type: 'text' },
        ],
      },
      {
        title: 'Post-Flight',
        items: [
          { number: 23, label: 'Remaining fuel (sensor)', description: 'GCS front panel', type: 'text' },
          { number: 24, label: 'Remaining fuel (integrated)', description: 'Platform status', type: 'text' },
          { number: 25, label: 'EPU', description: 'Connected', type: 'checkbox' },
          { number: 26, label: 'Battery status', description: 'Check external and &lt;27V', type: 'checkbox' },
          { number: 27, label: 'Lights', description: 'Nav and land OFF', type: 'checkbox' },
          { number: 28, label: 'Post Flight Walk-around', description: 'Begin', type: 'checkbox' },
          { number: 29, label: 'Time info panel', description: 'Stop Mission', type: 'checkbox' },
          { number: 30, label: 'Request and return transponder code (LISBOAMIL)', description: 'Areas deactivated Transponder code returned', type: 'checkbox' },
          { number: 31, label: 'Video REC', description: 'Stop', type: 'checkbox' },
          { number: 32, label: 'ATLAS', description: 'Download Report', type: 'checkbox' },
          { number: 33, label: 'Radar', description: 'ON', type: 'checkbox' },
          { number: 34, label: 'Download Data', description: 'Gimbal &amp; Radar data', type: 'checkbox' },
          { number: 35, label: 'Comms Manager', description: 'Shutdown', type: 'checkbox' },
          { number: 36, label: 'Post Flight Walk-around', description: 'Complete', type: 'checkbox' },
          { number: 37, label: 'Remote ID', description: 'OFF', type: 'checkbox' },
          { number: 38, label: 'Aircraft OFF', description: 'Critical &amp; Non-Critical', type: 'checkbox' },
        ],
      },
    ],
  };

  const checklistTemplates = [nocTemplate];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExportPDF = async () => {
    try {
      const html2pdf = await import('html2pdf.js');
      const element = document.getElementById('checklist-container');
      
      if (!element) return;
      
      const opt = {
        margin: 5,
        filename: `AR5_NOC_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };
      
      html2pdf.default().set(opt).from(element).save();
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tenta novamente.');
    }
  };

  if (!isClient) {
    return null;
  }

  const currentTemplate = checklistTemplates[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 backdrop-blur-md sticky top-0 z-40 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AR5 MK3 QRH</h1>
              <p className="text-slate-400 text-sm">Normal Operations Checklist</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 font-semibold">Tekever Flight Operations</p>
              <p className="text-slate-500 text-xs">Version 12 | 08-Oct-2024</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'checklist'
                  ? 'text-red-500 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              ✓ Checklist
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Export Button */}
        <div className="mb-6 flex gap-3 justify-end">
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            📥 Export to PDF
          </button>
        </div>

        {/* Checklist Container */}
        <div id="checklist-container" className="bg-white text-slate-900 p-8 rounded-lg shadow-lg">
          {/* PDF Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-slate-900">
            <div className="text-red-600 font-black text-2xl">TEKEVER</div>
            <div className="text-center">
              <h2 className="font-bold text-lg">Normal Operations Checklist</h2>
              <p className="text-sm">TEKEVER AR5 (MK3)</p>
            </div>
            <div className="text-right text-xs">
              <p>Version: <span className="font-bold">12</span></p>
              <p>Date: <span className="font-bold">08-Oct-2024</span></p>
              <p>Reference: <span className="font-bold text-blue-600">TAS-AR5-ETN-009_00</span></p>
            </div>
          </div>

          {currentTemplate && (
            <div className="space-y-8">
              {currentTemplate.sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  {/* Section Title */}
                  <div className="bg-slate-900 text-white py-2 px-4 font-bold uppercase text-sm mb-3 border-l-4 border-red-600">
                    {section.title}
                  </div>

                  {/* Section Items Table */}
                  <table className="w-full border-collapse mb-6">
                    <tbody>
                      {section.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border border-slate-400">
                          <td className="border border-slate-400 bg-slate-100 p-2 font-bold text-sm w-12 text-center">
                            {item.number}
                          </td>
                          <td className="border border-slate-400 p-2 font-semibold text-sm w-48">
                            {item.label}
                          </td>
                          <td className="border border-slate-400 p-2 text-sm flex-1">
                            {item.description && <p className="text-xs mb-2">{item.description}</p>}
                            {item.type === 'checkbox' ? (
                              <input
                                type="checkbox"
                                checked={(formData[`${section.title}-${item.number}`] as boolean) || false}
                                onChange={(e) => handleInputChange(`${section.title}-${item.number}`, e.target.checked)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            ) : (
                              <input
                                type={item.type}
                                placeholder={item.type === 'number' ? '0' : '___'}
                                value={(formData[`${section.title}-${item.number}`] as string) || ''}
                                onChange={(e) => handleInputChange(`${section.title}-${item.number}`, e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Observations Section */}
              <div className="border border-slate-400">
                <div className="flex">
                  <div className="border-r border-slate-400 p-3 font-semibold w-32">Observations</div>
                  <div className="flex-1 p-3">
                    <textarea
                      placeholder="Observations..."
                      value={(formData['observations'] as string) || ''}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      className="w-full border border-slate-300 rounded p-2 text-sm h-20"
                    />
                  </div>
                  <div className="border-l border-slate-400 p-3">
                    <div className="text-xs font-semibold mb-1">Date:</div>
                    <input
                      type="date"
                      value={(formData['date'] as string) || ''}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-xs w-32"
                    />
                    <div className="text-xs font-semibold mt-3 mb-1">Time:</div>
                    <input
                      type="time"
                      value={(formData['time'] as string) || ''}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-xs w-32"
                    />
                  </div>
                </div>
              </div>

              {/* RPIC Section */}
              <div className="border border-slate-400 flex">
                <div className="border-r border-slate-400 p-3 font-semibold w-24">RPIC</div>
                <div className="flex-1 p-3">
                  <input
                    type="text"
                    placeholder="Name..."
                    value={(formData['rpic'] as string) || ''}
                    onChange={(e) => handleInputChange('rpic', e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  />
                </div>
                <div className="border-l border-slate-400 p-3 font-semibold w-16">Print:</div>
                <div className="border-l border-slate-400 p-3 w-48">
                  <input
                    type="text"
                    placeholder="Print..."
                    className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  />
                </div>
                <div className="border-l border-slate-400 p-3 font-semibold w-16">Sign:</div>
                <div className="border-l border-slate-400 p-3 w-24"></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-slate-600 mt-8 pt-4 border-t border-slate-400">
            <p>Confidential</p>
          </div>
        </div>
      </main>
    </div>
  );
}
