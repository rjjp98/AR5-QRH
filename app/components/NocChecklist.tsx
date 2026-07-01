'use client';

import { useState, useEffect } from 'react';

type NocTab = 'preflight' | 'takeoff' | 'inflight' | 'prelanding' | 'postflight' | 'hourly' | 'handover';
type FieldValue = string | boolean | number;

interface NocHeader {
  aircraftID: string;
  date: string;
  trackerDlId: string;
  location: string;
  spControlId: string;
  missionType: string;
  nightDay: string;
  rpic: string;
  nocVersion: string;
  nocDate: string;
  nocReference: string;
}

interface FlightResume {
  takeoffDirection: string;
  takeoffWind: string;
  takeoffWeather: string;
  takeoffWeight: string;
  systemConfiguration: string;
  missionDescription: string;
  landingDirection: string;
  landingWind: string;
  landingWeather: string;
  landingWeightFuel: string;
  aircraftCondition: string;
  faultsDetected: string;
  safetyOccurrences: string;
  rpicName: string;
  rpicSign: string;
  rpicDate: string;
}

interface NocData {
  header: NocHeader;
  flightResume: FlightResume;
  fields: Record<string, FieldValue>;
}

const STORAGE_KEY = 'noc-checklist-v1';
const DEFAULT_NOC_VERSION = '5';

const TABS: { id: NocTab; label: string; icon: string }[] = [
  { id: 'preflight', label: 'PRE-FLIGHT', icon: '📋' },
  { id: 'takeoff', label: 'TAKE-OFF', icon: '🛫' },
  { id: 'inflight', label: 'IN-FLIGHT', icon: '✈️' },
  { id: 'prelanding', label: 'PRE-LANDING', icon: '🛬' },
  { id: 'postflight', label: 'POST-FLIGHT', icon: '🏁' },
  { id: 'hourly', label: 'HOURLY CHECKS', icon: '⏱️' },
  { id: 'handover', label: 'HANDOVER', icon: '🤝' },
];

const DEFAULT_DATA: NocData = {
  header: {
    aircraftID: '',
    date: '',
    trackerDlId: '',
    location: '',
    spControlId: '',
    missionType: '',
    nightDay: '',
    rpic: '',
    nocVersion: DEFAULT_NOC_VERSION,
    nocDate: '30-04-2026',
    nocReference: 'TAS-AR5-ETN-050_00',
  },
  flightResume: {
    takeoffDirection: '',
    takeoffWind: '',
    takeoffWeather: '',
    takeoffWeight: '',
    systemConfiguration: '',
    missionDescription: '',
    landingDirection: '',
    landingWind: '',
    landingWeather: '',
    landingWeightFuel: '',
    aircraftCondition: '',
    faultsDetected: '',
    safetyOccurrences: '',
    rpicName: '',
    rpicSign: '',
    rpicDate: '',
  },
  fields: {},
};

export default function NocChecklist() {
  const [activeTab, setActiveTab] = useState<NocTab>('preflight');
  const [data, setData] = useState<NocData>(DEFAULT_DATA);
  const [isClient, setIsClient] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<NocData>;
        setData({
          header: { ...DEFAULT_DATA.header, ...(parsed.header ?? {}) },
          flightResume: { ...DEFAULT_DATA.flightResume, ...(parsed.flightResume ?? {}) },
          fields: parsed.fields ?? {},
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      // ignore storage errors
    }
  }, [data, isClient]);

  const updateHeader = (field: keyof NocHeader, value: string) =>
    setData(prev => ({ ...prev, header: { ...prev.header, [field]: value } }));

  const updateFlightResume = (field: keyof FlightResume, value: string) =>
    setData(prev => ({ ...prev, flightResume: { ...prev.flightResume, [field]: value } }));

  const updateField = (key: string, value: FieldValue) =>
    setData(prev => ({ ...prev, fields: { ...prev.fields, [key]: value } }));

  const getStr = (key: string): string => {
    const v = data.fields[key];
    return typeof v === 'string' ? v : '';
  };

  const getBool = (key: string): boolean => {
    const v = data.fields[key];
    return typeof v === 'boolean' ? v : false;
  };

  const getNum = (key: string): number | '' => {
    const v = data.fields[key];
    return typeof v === 'number' ? v : '';
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('noc-printable');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const aircraft = data.header.aircraftID.trim() || 'UNKNOWN_AIRCRAFT';
    const mission = data.header.missionType.trim() || 'UNKNOWN_MISSION';
    const filename = `NOC_${aircraft}_${mission}.pdf`;
    html2pdf()
      .set({
        margin: 10,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  const handleReset = () => {
    if (!confirm('Reset all NOC data? This cannot be undone.')) return;
    setData(DEFAULT_DATA);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  if (!isClient) return null;

  const headerFields: { key: keyof NocHeader; label: string; type?: string }[] = [
    { key: 'aircraftID', label: 'Aircraft ID #', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'trackerDlId', label: 'Tracker / DL ID #', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'spControlId', label: 'SP Control ID #', type: 'text' },
    { key: 'missionType', label: 'Mission Type', type: 'text' },
    { key: 'nightDay', label: 'Night / Day', type: 'text' },
    { key: 'rpic', label: 'RPIC', type: 'text' },
  ];

  const resumeFields: { key: keyof FlightResume; label: string; type: string }[] = [
    { key: 'takeoffDirection', label: 'Take-off Direction', type: 'text' },
    { key: 'takeoffWind', label: 'Take-off Wind', type: 'text' },
    { key: 'takeoffWeather', label: 'Take-off Weather', type: 'text' },
    { key: 'takeoffWeight', label: 'Take-off Weight', type: 'text' },
    { key: 'systemConfiguration', label: 'System configuration', type: 'textarea' },
    { key: 'missionDescription', label: 'Mission Description / Observations', type: 'textarea' },
    { key: 'landingDirection', label: 'Landing Direction', type: 'text' },
    { key: 'landingWind', label: 'Landing Wind', type: 'text' },
    { key: 'landingWeather', label: 'Landing Weather', type: 'text' },
    { key: 'landingWeightFuel', label: 'Landing Weight/Fuel', type: 'text' },
    { key: 'aircraftCondition', label: 'Aircraft Condition', type: 'textarea' },
    { key: 'faultsDetected', label: 'Faults Detected', type: 'textarea' },
    { key: 'safetyOccurrences', label: 'Safety Occurrences', type: 'textarea' },
  ];

  return (
    <div className="space-y-4" id="noc-printable">
      {/* ── Header ── */}
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              NOC — Normal Operations Checklist
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">AR5 MK3 · Tekever Flight Operations</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {lastSaved && (
              <span className="text-slate-500 text-xs">💾 Saved {lastSaved}</span>
            )}
            <button
              onClick={handleExportPDF}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-sm transition"
            >
              📄 Export PDF
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded font-bold text-sm transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {headerFields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">
                {label}
              </label>
              <input
                type={type ?? 'text'}
                value={data.header[key]}
                onChange={e => updateHeader(key, e.target.value)}
                placeholder={label}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Version</label>
            <input type="text" value={data.header.nocVersion} onChange={e => updateHeader('nocVersion', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">NOC Date</label>
            <input type="text" value={data.header.nocDate} onChange={e => updateHeader('nocDate', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">Reference</label>
            <input type="text" value={data.header.nocReference} onChange={e => updateHeader('nocReference', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
          </div>
        </div>
      </div>

      {/* ── Flight Resume ── */}
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h3 className="text-base font-black text-white uppercase tracking-wide mb-4">
          Flight Resume
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumeFields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  value={data.flightResume[key]}
                  onChange={e => updateFlightResume(key, e.target.value)}
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={data.flightResume[key]}
                  onChange={e => updateFlightResume(key, e.target.value)}
                  placeholder={label}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <h4 className="text-sm font-black text-white uppercase tracking-wide mb-3">Flight Crew</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-700">
                  <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold w-16">#</th>
                  <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold">Name</th>
                  <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold">Role</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={`crew-resume-${i}`} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                    <td className="border border-slate-600 px-3 py-2 text-slate-300">{i + 1}</td>
                    <td className="border border-slate-600 p-1">
                      <input type="text" value={getStr(`resume-crew-name-${i + 1}`)} onChange={e => updateField(`resume-crew-name-${i + 1}`, e.target.value)} className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded" />
                    </td>
                    <td className="border border-slate-600 p-1">
                      <input type="text" value={getStr(`resume-crew-role-${i + 1}`)} onChange={e => updateField(`resume-crew-role-${i + 1}`, e.target.value)} className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4">
          <RpicSignRow prefix="resume" getStr={getStr} update={updateField} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-900/50">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 py-3 px-4 font-bold text-xs uppercase tracking-wide transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-red-400 border-red-500 bg-slate-800'
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'preflight' && (
            <PreFlightTab getStr={getStr} getBool={getBool} getNum={getNum} update={updateField} />
          )}
          {activeTab === 'takeoff' && (
            <TakeOffTab getStr={getStr} getBool={getBool} update={updateField} />
          )}
          {activeTab === 'inflight' && (
            <InFlightTab getStr={getStr} update={updateField} />
          )}
          {activeTab === 'prelanding' && (
            <PreLandingTab getStr={getStr} getBool={getBool} update={updateField} />
          )}
          {activeTab === 'postflight' && (
            <PostFlightTab getBool={getBool} getStr={getStr} update={updateField} />
          )}
          {activeTab === 'hourly' && (
            <HourlyChecksTab getStr={getStr} update={updateField} />
          )}
          {activeTab === 'handover' && (
            <HandoverTab getStr={getStr} update={updateField} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   PRE-FLIGHT tab — structural skeleton (Phase 1)
   Full ~80 fields added in Phase 2
──────────────────────────────────────────────── */
interface FieldProps {
  getStr: (key: string) => string;
  getBool: (key: string) => boolean;
  getNum?: (key: string) => number | '';
  update: (key: string, value: FieldValue) => void;
}

type ChecklistInputType = 'check' | 'text' | 'number' | 'time';
interface ChecklistRow {
  id: string;
  num: string;
  item: string;
  action: string;
  input: ChecklistInputType;
  placeholder?: string;
}

function ChecklistTable({
  title,
  rows,
  getStr,
  getBool,
  update,
}: {
  title: string;
  rows: ChecklistRow[];
  getStr: (key: string) => string;
  getBool: (key: string) => boolean;
  update: (key: string, value: FieldValue) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-black text-sm">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[980px]">
          <thead>
            <tr className="bg-slate-700">
              <th className="border border-slate-600 px-2 py-2 w-14 text-center text-white font-bold">#</th>
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold w-72">Item</th>
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold">Action / Value</th>
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold w-52">Record</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">{row.num}</td>
                <td className="border border-slate-600 px-3 py-2 text-white whitespace-pre-line">{row.item}</td>
                <td className="border border-slate-600 px-3 py-2 text-slate-200 whitespace-pre-line">{row.action}</td>
                <td className="border border-slate-600 p-1">
                  {row.input === 'check' ? (
                    <label className="flex items-center justify-center">
                      <input type="checkbox" checked={getBool(row.id)} onChange={e => update(row.id, e.target.checked)} className="w-5 h-5 accent-red-500" />
                    </label>
                  ) : (
                    <input
                      type={row.input}
                      value={getStr(row.id)}
                      onChange={e => update(row.id, e.target.value)}
                      placeholder={row.placeholder ?? '—'}
                      className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreFlightTab({ getStr, getBool, update }: FieldProps) {
  const rows: ChecklistRow[] = [
    { id: 'pf-1', num: '1', item: 'Daily Briefing / I’M SAFE', action: 'Conducting the Daily Briefing and the I’M SAFE Procedure', input: 'check' },
    { id: 'pf-2', num: '2', item: 'Registration Number', action: 'Confirm PRTpw866e5m72qwx affixed on aircraft', input: 'check' },
    { id: 'pf-3', num: '3', item: 'Multi-Country Airspace Check', action: 'Check official sources for all airspace restrictions for all countries involved in the mission.', input: 'text' },
    { id: 'pf-4', num: '4', item: 'Two-Person NOTAM Verification and sign (MANDATORY)', action: 'Portugal: UAS Geozones https://dnt.anac.pt/mapa.html | NOTAMs https://fplbriefing.nav.pt/login', input: 'text' },
    { id: 'pf-4b', num: '', item: '', action: 'Spain: NOTAMs / UAS Geozones https://drones.enaire.es/ | BOTH RPIC AND RP MUST PERFORM THIS CHECK INDEPENDENTLY, SIGN-OFF', input: 'text' },
    { id: 'pf-5', num: '5', item: 'Emergency Situations Check', action: 'Check & Log - PT: prociv-portal.geomai.mai.gov.pt ES: ran-vmap.proteccioncivil.es/ (if Cross Border Flight)', input: 'text' },
    { id: 'pf-6', num: '6', item: 'Data Link & Tracker', action: 'ON', input: 'check' },
    { id: 'pf-7', num: '7', item: 'Browser', action: 'Check local radio settings (.51)', input: 'check' },
    { id: 'pf-8', num: '8', item: 'VPN', action: 'ON', input: 'check' },
    { id: 'pf-9', num: '9', item: 'AWS Remote Desktop', action: 'Start all (telemetry and OBC)', input: 'check' },
    { id: 'pf-10', num: '10', item: 'Comms Check', action: 'OK', input: 'check' },
    { id: 'pf-11', num: '11', item: 'EPU and Wheel Chocks', action: 'Check EPU ON and Chocks fitted', input: 'check' },
    { id: 'pf-12', num: '12', item: 'Birdfinder', action: 'Turn ON and check signal - BEFORE closing canopy', input: 'check' },
    { id: 'pf-13', num: '13', item: 'Remote ID', action: 'Verify broadcast', input: 'check' },
    { id: 'pf-14', num: '14', item: 'Technician Handover', action: 'Aircraft OK', input: 'check' },
    { id: 'pf-15', num: '15', item: '', action: 'Fuel Quantity (L): Ask MT & Log', input: 'number' },
    { id: 'pf-16', num: '16', item: '', action: 'Take Off Weight (Kg): Ask MT & Log', input: 'number' },
    { id: 'pf-17', num: '17', item: 'SPC Checklist', action: 'Complete', input: 'check' },
    { id: 'pf-18', num: '18', item: '', action: 'Correct Model, Trims, Screen locked, battery RC percentage', input: 'text' },
    { id: 'pf-19', num: '19', item: 'Aircraft Level', action: '+- 5 degrees pitch', input: 'check' },
    { id: 'pf-20', num: '20', item: '', action: '+-5 degrees roll', input: 'check' },
    { id: 'pf-21', num: '21', item: 'Pitot Cover', action: 'Fitted', input: 'check' },
    { id: 'pf-22', num: '22', item: 'Aircraft ON', action: 'BMS Switches: Critical and Non-Critical On | System Initializing (Wait 30 seconds)', input: 'check' },
    { id: 'pf-23', num: '23', item: 'Initialization', action: 'Complete', input: 'check' },
    { id: 'pf-24', num: '24', item: 'Screen Recorder', action: 'Start Recording', input: 'check' },
    { id: 'pf-25', num: '25', item: 'GCS', action: 'Show config editor / load / start selected', input: 'check' },
    { id: 'pf-26', num: '26', item: 'Mode', action: 'Manual', input: 'check' },
    { id: 'pf-27', num: '27', item: 'SPC Ignition Test', action: 'Turn OFF and back ON, Check OFF in GCS', input: 'check' },
    { id: 'pf-28', num: '28', item: 'Ignition', action: 'Ignition ON', input: 'check' },
    { id: 'pf-29', num: '29', item: 'Throttle %', action: '<12%', input: 'number' },
    { id: 'pf-30', num: '30', item: 'GCS Avionics Tab', action: 'Check all Fuses are Present', input: 'check' },
    { id: 'pf-31', num: '31', item: '', action: 'Check all Fuses are Green/ON', input: 'check' },
    { id: 'pf-32', num: '32', item: 'Accelerometer', action: 'Ax and Ax2 (-100:100, max dif. 50)', input: 'text' },
    { id: 'pf-33', num: '33', item: '', action: 'Ay and Ay2 (-100:100, max dif. 50)', input: 'text' },
    { id: 'pf-34', num: '34', item: '', action: 'Ayz and Az2 (-1080:-880, max dif. 50)', input: 'text' },
    { id: 'pf-35', num: '35', item: 'Gyro', action: 'Gx and Gx2 (-100:100)', input: 'text' },
    { id: 'pf-36', num: '36', item: '', action: 'Gy and Gy2 (-100:100)', input: 'text' },
    { id: 'pf-37', num: '37', item: '', action: 'Gz and Gz2 (-100:100)', input: 'text' },
    { id: 'pf-38', num: '38', item: 'EPU Connected', action: 'Check EPU as power source', input: 'check' },
    { id: 'pf-39', num: '39', item: '', action: 'Confirm battery SOC>90%', input: 'check' },
    { id: 'pf-40', num: '40', item: 'GPS: EKF Table', action: 'Check all 3 instances scores are green', input: 'check' },
    { id: 'pf-41', num: '41', item: '', action: 'Check all 3 instances are enabled', input: 'check' },
    { id: 'pf-42', num: '42', item: '', action: 'Check which instance is in-use', input: 'text' },
    { id: 'pf-43', num: '43', item: '', action: 'GPS1 Status', input: 'text' },
    { id: 'pf-44', num: '44', item: '', action: 'GPS1 - Sats > 6', input: 'number' },
    { id: 'pf-45', num: '45', item: '', action: 'GPS2 Status', input: 'text' },
    { id: 'pf-46', num: '46', item: '', action: 'GPS2 - Sats > 6', input: 'number' },
    { id: 'pf-47', num: '47', item: '', action: 'GPS3 Status', input: 'text' },
    { id: 'pf-48', num: '48', item: '', action: 'GPS3 - Sats > 6', input: 'number' },
    { id: 'pf-49', num: '49', item: '', action: 'HDOP (<1)', input: 'number' },
    { id: 'pf-50', num: '50', item: '', action: 'VDOP [ 0.8 : 1.5 ]', input: 'number' },
    { id: 'pf-51', num: '51', item: 'Pre-Flight Walkaround', action: 'Complete', input: 'check' },
    { id: 'pf-52', num: '52', item: '', action: 'Observations:', input: 'text' },
    { id: 'pf-53', num: '53', item: 'SPC Logs Record', action: 'Start Recording', input: 'check' },
    { id: 'pf-54', num: '54', item: 'SPC Range Check', action: 'Clear to perform range check', input: 'check' },
    { id: 'pf-55', num: '55', item: 'Throttle Failsafe', action: 'Check autopilot messages', input: 'text' },
    { id: 'pf-56', num: '56', item: 'Magnetometer', action: 'Graph Mx, Mx2, Mx3 and check if values are coherent', input: 'check' },
    { id: 'pf-57', num: '57', item: '', action: 'Graph My, My2, My3 and check if values are coherent', input: 'check' },
    { id: 'pf-58', num: '58', item: '', action: 'Graph Mz, Mz2, Mz3 and check if values are coherent', input: 'check' },
    { id: 'pf-59', num: '59', item: 'RLOS', action: 'OK (100%) & RSSI>-15', input: 'text' },
    { id: 'pf-60', num: '60', item: 'RLOS-B', action: 'OK (100%)', input: 'text' },
    { id: 'pf-61', num: '61', item: '4G', action: 'OK (100%)', input: 'text' },
    { id: 'pf-62', num: '62', item: 'RSSI', action: 'Check RSSI values on tracker during taxi', input: 'text' },
    { id: 'pf-63', num: '63', item: 'Satcom Service', action: 'ON', input: 'check' },
    { id: 'pf-64', num: '64', item: 'SATCOM-B Mode', action: 'Set to ON', input: 'check' },
    { id: 'pf-65', num: '65', item: 'SATCOM-B', action: '100%', input: 'text' },
    { id: 'pf-66', num: '66', item: 'Remaining fuel (sensor)', action: 'Check and Log value', input: 'number' },
    { id: 'pf-67', num: '67', item: 'Initial fuel level', action: 'Input & Log value', input: 'number' },
    { id: 'pf-68', num: '68', item: 'Parameters', action: 'Refresh', input: 'check' },
    { id: 'pf-69', num: '69', item: 'GROUND_STEER_ALT', action: 'VALUE 5', input: 'text' },
    { id: 'pf-70', num: '70', item: 'TRIM_ARSPD_CM', action: 'VALUE: 2700 <150kg', input: 'text' },
    { id: 'pf-71', num: '71', item: '', action: '2800 >150kg', input: 'text' },
    { id: 'pf-72', num: '72', item: '', action: '2900 >165kg', input: 'text' },
    { id: 'pf-73', num: '73', item: 'ALT_HOLD_RTL', action: 'VALUE -1', input: 'text' },
    { id: 'pf-74', num: '74', item: 'Airspeed', action: '0<VALUE<10', input: 'text' },
    { id: 'pf-75', num: '75', item: 'Barometer', action: 'Check Value', input: 'text' },
    { id: 'pf-76', num: '76', item: 'Lidar distance', action: 'Start graph, Check value ]0,3]', input: 'text' },
    { id: 'pf-77', num: '77', item: 'Mode FBWA', action: 'Change', input: 'check' },
    { id: 'pf-78', num: '78', item: 'Roll Left', action: 'Check Left Aileron Down / Right Aileron Up / Lidar Increase / Instruments', input: 'check' },
    { id: 'pf-79', num: '79', item: 'Pitch Up', action: 'Check Elevators Down / Instruments', input: 'check' },
  ];

  return <ChecklistTable title="Pre-Flight Checklist (1–79)" rows={rows} getStr={getStr} getBool={getBool} update={update} />;
}

/* ────────────────────────────────────────────────
   TAKE-OFF — NOC page alignment (rows 80–97)
──────────────────────────────────────────────── */
function TakeOffTab({ getStr, getBool, update }: { getStr: (k: string) => string; getBool: (k: string) => boolean; update: (k: string, v: FieldValue) => void }) {
  const rows: ChecklistRow[] = [
    { id: 'to-80', num: '80', item: 'Roll Right', action: 'Check Left Aileron Up/ Right Aileron Down/ Lidar Increase / Instruments', input: 'check' },
    { id: 'to-81', num: '81', item: 'Pitot', action: 'Remove cover', input: 'check' },
    { id: 'to-82', num: '82', item: 'Airspeed Test', action: 'Check EKF Table for Instance in use — Airspeed 1 test', input: 'check' },
    { id: 'to-83', num: '83', item: '', action: 'Airspeed 2 test', input: 'check' },
    { id: 'to-84', num: '84', item: '', action: 'Airspeed 3 test', input: 'check' },
    { id: 'to-85', num: '85', item: 'Mode Manual', action: 'Change', input: 'check' },
    { id: 'to-86', num: '86', item: 'RC receivers Availability', action: 'Check 2 receivers available', input: 'check' },
    { id: 'to-87-pt', num: '87', item: 'Weather Conditions Limits:\n→ Headwind ≤25kts (gusts 30)\n→ Crosswind ≤14kts (gusts 17)\n→ Cruise ≤35kts\n→ Tailwind ≤5kts\n→ Temp -10–40°C', action: 'Check & log PT - IPMA', input: 'text' },
    { id: 'to-87-es', num: '', item: '', action: 'Check & log ES - AEMET (if Cross Border Flight)', input: 'text' },
    { id: 'to-88', num: '88', item: 'Runway', action: 'Check runway and take-off direction', input: 'text' },
    { id: 'to-89', num: '89', item: 'Payload Configuration', action: 'Confirm payload config/status. Observations:', input: 'text' },
    { id: 'to-90', num: '90', item: 'Gimbal', action: 'Set to PROTECT', input: 'check' },
    { id: 'to-91', num: '91', item: 'SAR / VIDAR', action: 'ON and confirm PROTECT mode', input: 'check' },
    { id: 'to-92-1', num: '92', item: 'Routes\n1. Read\nIf needed:\n1. Load,\n2. Write\n3. Read', action: 'Mission Loaded', input: 'check' },
    { id: 'to-92-2', num: '', item: '', action: 'Prepare Take-off Set', input: 'check' },
    { id: 'to-92-3', num: '', item: '', action: 'Loiter radius min 250m', input: 'text' },
    { id: 'to-92-4', num: '', item: '', action: 'CW or CCW', input: 'text' },
    { id: 'to-92-5', num: '', item: '', action: 'WP radius 100', input: 'text' },
    { id: 'to-92-6', num: '', item: '', action: 'Prepare Landing Set', input: 'check' },
    { id: 'to-92-7', num: '', item: '', action: 'LANDING Waypoint Set', input: 'check' },
    { id: 'to-92-8', num: '', item: '', action: 'Lock Heading', input: 'check' },
    { id: 'to-92-9', num: '', item: '', action: 'Check loaded Rally points', input: 'check' },
    { id: 'to-93', num: '93', item: 'Transponder', action: 'Switch ON', input: 'check' },
    { id: 'to-94', num: '94', item: 'Flight ID', action: 'Set Flight ID (TEK01/02)', input: 'text' },
    { id: 'to-95', num: '95', item: 'Aircraft Address', action: 'Set Aircraft Address', input: 'text' },
    { id: 'to-96', num: '96', item: 'Squawk Code', action: 'Set VFR Squawk (A5656)', input: 'text' },
    { id: 'to-97', num: '97', item: 'ACS Mode', action: 'Set STANDBY on ground', input: 'check' },
    { id: 'to-98', num: '98', item: 'Navigation Lights', action: 'ON', input: 'check' },
    { id: 'to-99', num: '99', item: 'Strobe lights', action: 'ON', input: 'check' },
    { id: 'to-100', num: '100', item: 'Landing Lights', action: 'ON & OFF', input: 'check' },
    { id: 'to-101', num: '101', item: 'Request Startup', action: 'Permission Granted', input: 'check' },
    { id: 'to-102', num: '102', item: 'EPU', action: 'Remove EPU / Close Hatch', input: 'check' },
    { id: 'to-103', num: '103', item: '', action: 'Power source: Batteries', input: 'check' },
    { id: 'to-104', num: '104', item: 'Throttle', action: 'Idle', input: 'check' },
    { id: 'to-105', num: '105', item: 'Ignition', action: 'ON', input: 'check' },
    { id: 'to-106', num: '106', item: 'Brakes', action: 'ON', input: 'check' },
    { id: 'to-107', num: '107', item: 'Startup #1 & #2', action: 'Time:', input: 'time' },
    { id: 'to-108', num: '108', item: 'Engine Warm Up', action: 'Aprox. 2000RPM', input: 'text' },
    { id: 'to-109', num: '109', item: 'Engine Status', action: 'Check Engine Sensors Alive and Plausible', input: 'check' },
    { id: 'to-110', num: '110', item: 'Engine Temperature', action: 'Check >=100ºC #1 & #2', input: 'text' },
    { id: 'to-111', num: '111', item: 'Ignition tests @3000rpm', action: 'CDI 1 OFF Check TPS increase, 3000rpm', input: 'check' },
    { id: 'to-112', num: '112', item: '', action: 'CDI 1 ON Check TPS decrease, 3000rpm', input: 'check' },
    { id: 'to-113', num: '113', item: '', action: 'CDI 3 OFF Check TPS increase, 3000rpm', input: 'check' },
    { id: 'to-114', num: '114', item: '', action: 'CDI 3 ON Check TPS decrease, 3000rpm', input: 'check' },
    { id: 'to-115', num: '115', item: '', action: 'CDI 2 OFF Check TPS increase, 3000rpm', input: 'check' },
    { id: 'to-116', num: '116', item: '', action: 'CDI 2 ON Check TPS decrease, 3000rpm', input: 'check' },
    { id: 'to-117', num: '117', item: '', action: 'CDI 4 OFF Check TPS increase, 3000rpm', input: 'check' },
    { id: 'to-118', num: '118', item: '', action: 'CDI 4 ON Check TPS decrease, 3000rpm', input: 'check' },
    { id: 'to-119', num: '119', item: 'SP-170 Engine Max RPM Test (5s)', action: '(check>5200RPM) Max RPM #1 and Max RPM #2', input: 'text' },
    { id: 'to-120', num: '120', item: 'Ekarus 280 Engine Max RPM Test (5s)', action: '(check>4900RPM) Max RPM #1 and Max RPM #2', input: 'text' },
    { id: 'to-121', num: '121', item: 'Battery & Generator Status', action: 'Generator Swap @ [2250 RPM, 2750 RPM]', input: 'check' },
    { id: 'to-122', num: '122', item: 'Request Taxi', action: 'Permission Granted', input: 'check' },
    { id: 'to-123', num: '123', item: 'Wheel Chocks', action: 'Removed', input: 'check' },
    { id: 'to-124', num: '124', item: 'Check Controls', action: 'Manual and FBWA', input: 'check' },
    { id: 'to-125', num: '125', item: 'Check Brakes', action: 'Manual and FBWA', input: 'check' },
    { id: 'to-126', num: '126', item: 'Check Steering', action: 'Manual and FBWA', input: 'check' },
    { id: 'to-127', num: '127', item: 'Tracker', action: 'Tracking Aircraft Correctly', input: 'check' },
    { id: 'to-128', num: '128', item: 'Stop on Runway', action: 'Set Home Altitude & Set Home Position', input: 'check' },
    { id: 'to-129', num: '129', item: 'Route', action: 'Check aircraft heading, route, altitudes, and write to the aircraft', input: 'check' },
    { id: 'to-130', num: '130', item: 'Request Take-off', action: 'Permission Granted', input: 'check' },
    { id: 'to-131', num: '131', item: 'Time info panel', action: 'Start Mission', input: 'check' },
    { id: 'to-132', num: '132', item: 'Engines', action: 'Clear Engines', input: 'check' },
    { id: 'to-133', num: '133', item: 'Take-off', action: 'Time:', input: 'time' },
    { id: 'to-134', num: '134', item: 'Take-off Complete', action: 'General Status OK', input: 'check' },
    { id: 'to-135', num: '135', item: 'Change THR_MIN', action: 'Change THR_MIN to 30%', input: 'check' },
    { id: 'to-136', num: '136', item: 'SATCOM On', action: 'Satcom VMBR + ACU', input: 'check' },
    { id: 'to-137', num: '137', item: 'Radar On', action: 'Radar', input: 'check' },
    { id: 'to-138', num: '138', item: 'IMSAR', action: 'SAR ON (if fitted)', input: 'check' },
    { id: 'to-139', num: '139', item: 'Browser', action: 'Check Satcom IP', input: 'check' },
    { id: 'to-140', num: '140', item: 'Ground Steer', action: 'Set GROUND_STEER_ALT = 0', input: 'check' },
    { id: 'to-141', num: '141', item: 'SPC', action: 'Off', input: 'check' },
  ];

  return <ChecklistTable title="Before Take-off Checklist (80–141)" rows={rows} getStr={getStr} getBool={getBool} update={update} />;
}

/* ────────────────────────────────────────────────
   HOURLY CHECKS — Flight Checks (hourly) — Page 10
──────────────────────────────────────────────── */
const HOURLY_COLS = ['Engine Start', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'LAND'] as const;
const HOURLY_ROWS: { id: string; label: string }[] = [
  { id: 'schedule', label: 'Schedule (hh:mm)' },
  { id: 'fuel-proj', label: 'Fuel (projected)' },
  { id: 'fuel-sensor', label: 'Fuel (sensor)' },
  { id: 'fuel-cons', label: 'Fuel Consumption (L/h)' },
  { id: 'mass', label: 'Aircraft Mass' },
  { id: 'weather', label: 'Weather checks\n(PT: IPMA / ES: AEMET per FIR)' },
  { id: 'geozones', label: 'Check UAS Geozones\n(PT: dnt.anac.pt / ES: drones.enaire.es per FIR)' },
  { id: 'emergency', label: 'Check for Emergency\nSituations (**)' },
];

function HourlyChecksTab({ getStr, update }: { getStr: (k: string) => string; update: (k: string, v: FieldValue) => void }) {
  const colKey = (col: string) => col.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-xs italic">Fill table with Fuel Sensor Data, Weather Checks and Aircraft Mass</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-700">
              <th className="border border-slate-600 px-2 py-2 text-left text-white font-bold w-36">Flight Time (h)</th>
              {HOURLY_COLS.map(col => (
                <th key={col} className={`border border-slate-600 px-2 py-2 text-center text-white font-bold ${col === 'Engine Start' ? 'w-24' : 'w-14'}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURLY_ROWS.map((row, ri) => (
              <tr key={row.id} className={ri % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}>
                <td className="border border-slate-600 px-2 py-1 text-slate-200 text-xs leading-tight whitespace-pre-line">
                  {row.label}
                </td>
                {HOURLY_COLS.map(col => (
                  <td key={col} className="border border-slate-600 p-0.5">
                    <input
                      type="text"
                      value={getStr(`hourly-${row.id}-${colKey(col)}`)}
                      onChange={e => update(`hourly-${row.id}-${colKey(col)}`, e.target.value)}
                      className="w-full bg-transparent text-white text-xs text-center px-1 py-1 focus:outline-none focus:bg-slate-700 rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs">
        (**) PT:{' '}
        <a href="https://prociv-portal.geomai.mai.gov.pt/arcgis/home" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
          prociv-portal.geomai.mai.gov.pt/arcgis/home
        </a>{' '}
        | ES:{' '}
        <a href="https://ran-vmap.proteccioncivil.es/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
          ran-vmap.proteccioncivil.es
        </a>
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────
   IN-FLIGHT — FIR Crossing Coordination — Page 11
──────────────────────────────────────────────── */
const FIR_ENTRIES = Array.from({ length: 10 }, (_, i) => i + 1);

function InFlightTab({ getStr, update }: { getStr: (k: string) => string; update: (k: string, v: FieldValue) => void }) {
  return (
    <div className="space-y-6">
      {/* ES Activation */}
      <div>
        <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-2">ES Activation</h4>
        <div className="bg-slate-900/50 rounded p-4 text-xs text-slate-300 leading-relaxed space-y-1 border border-slate-700">
          <p>
            The RPIC will call SPV/Jefe de Sala{' '}
            <span className="text-red-400 font-semibold">(+34 954 555 416)</span>{' '}
            30 minutes before entering FIR LECS.
          </p>
          <p>
            Inform: (1) Entry zone ONLY via EMSA01, EMSA03 or EMSA04, (2) Work area, (3) Next planned areas.
          </p>
          <p>SPV communicates to ECAO Sevilla (+34 954 555 490/1) for SACTA activation.</p>
          <p>Zone-by-zone: activate ONLY current zone. Call SPV each time leaving one zone and entering the next.</p>
          <p>
            <span className="text-red-400 font-semibold">Deactivation:</span> Call immediately upon exiting.
          </p>
        </div>
      </div>

      {/* ES Notes */}
      <div>
        <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-2">ES Notes</h4>
        <ul className="bg-slate-900/50 rounded p-4 text-xs text-slate-300 leading-relaxed space-y-1 border border-slate-700 list-disc list-inside">
          <li>Transponder Mode C: Must remain ACTIVE throughout Spanish segment</li>
          <li>ENAIRE Reference: 01033-2026 COOP | Military Reference: C0107</li>
          <li>FIR LECS Entry: ONLY via EMSA01, EMSA03, or EMSA04</li>
          <li>ECAO Sevilla (D-1): Confirm zone availability day prior — Tel: +34 954 555 490/1</li>
          <li>LECS ACC Frequencies: Monitor per zone: 120.8 / 135.025 / 128.5 MHz</li>
          <li>Spain General Aviation Freq: Monitor 121.500 MHz</li>
          <li>Guadalquivir (Area 12) IF APPLICABLE: LER154 Authorization Required. El Copero TWR Freq: 126.750 MHz</li>
        </ul>
      </div>

      {/* FIR Entry Log */}
      <div>
        <h4 className="text-white font-black text-sm mb-2">FIR Entry Log</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-700">
                <th className="border border-slate-600 px-2 py-2 text-center text-white font-bold w-12">Entry #</th>
                <th className="border border-slate-600 px-2 py-2 text-center text-white font-bold w-28">Time (UTC)</th>
                <th className="border border-slate-600 px-2 py-2 text-center text-white font-bold w-36">Entering FIR (PT/ES)</th>
                <th className="border border-slate-600 px-2 py-2 text-center text-white font-bold w-32">Clearance Received</th>
                <th className="border border-slate-600 px-2 py-2 text-center text-white font-bold">Notes & Observations</th>
              </tr>
            </thead>
            <tbody>
              {FIR_ENTRIES.map(n => (
                <tr key={n} className="bg-slate-800">
                  <td className={`border border-slate-600 px-2 py-1 text-center font-bold ${n === 1 || n === 10 ? 'text-red-400' : 'text-slate-300'}`}>
                    {n}
                  </td>
                  {(['time', 'entering', 'clearance', 'notes'] as const).map(field => (
                    <td key={field} className="border border-slate-600 p-0.5">
                      <input
                        type="text"
                        value={getStr(`fir-${n}-${field}`)}
                        onChange={e => update(`fir-${n}-${field}`, e.target.value)}
                        className="w-full bg-transparent text-white text-xs px-2 py-1 focus:outline-none focus:bg-slate-700 rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Reference */}
      <div>
        <h4 className="text-white font-black text-sm mb-2">Contact Reference</h4>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold w-24">Country</th>
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold">Primary Contact</th>
              <th className="border border-slate-600 px-3 py-2 text-left text-white font-bold">Backup Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Portugal</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-300">
                Comando Aereo ISR<br />
                <span className="text-blue-400">351 911 849 012</span>
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-300">
                Comando Aereo ISR<br />
                <span className="text-blue-400">351 911 826 599 / 351 965 695 539</span>
              </td>
            </tr>
            <tr className="bg-slate-800/50">
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Spain</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-300">
                ACC SEVILHA<br />
                <span className="text-blue-400">0034-954 555 416</span>
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-300">
                Backup<br />
                <span className="text-blue-400">0034-954 555 490/1</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RPIC sign-off */}
      <RpicSignRow prefix="fir" getStr={getStr} update={update} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   PRE-LANDING — Landing checklist (1–35)
──────────────────────────────────────────────── */
function PreLandingTab({ getStr, getBool, update }: FieldProps) {
  const rows: ChecklistRow[] = [
    { id: 'pl-1', num: '1', item: 'Runway', action: 'Check runway direction', input: 'check' },
    { id: 'pl-2', num: '2', item: 'IMSAR', action: 'SAR OFF (if fitted)', input: 'check' },
    { id: 'pl-3', num: '3', item: 'SATCOM OFF', action: 'Satcom VMBR + ACU', input: 'check' },
    { id: 'pl-4', num: '4', item: 'Change THR_MIN', action: 'Change THR_MIN to 0%', input: 'check' },
    { id: 'pl-5', num: '5', item: 'Ground Steer', action: 'Set GROUND_STEER_ALT = 5', input: 'check' },
    { id: 'pl-6', num: '6', item: 'TRIM_ARSPD_CM', action: 'Check value and landing weight', input: 'text' },
    { id: 'pl-7', num: '7', item: 'Radar', action: 'STDBY and OFF', input: 'check' },
    { id: 'pl-8', num: '8', item: 'Comms Check', action: 'OK', input: 'check' },
    { id: 'pl-9', num: '9', item: 'Aircraft', action: 'In Sight', input: 'check' },
    { id: 'pl-10', num: '10', item: 'SPC Checklist', action: 'OK & ON', input: 'check' },
    { id: 'pl-11', num: '11', item: 'SP Log Recorder', action: 'Start Recording', input: 'check' },
    { id: 'pl-12', num: '12', item: 'Brakes', action: 'OFF', input: 'check' },
    { id: 'pl-13', num: '13', item: 'Lights', action: 'ON', input: 'check' },
    { id: 'pl-14', num: '14', item: 'Clearance', action: 'Permission to land', input: 'check' },
    { id: 'pl-15', num: '15', item: 'Landing', action: 'Time:', input: 'time' },
    { id: 'pl-16', num: '16', item: 'Vacate', action: 'Runway vacated', input: 'check' },
    { id: 'pl-17', num: '17', item: 'Strobes', action: 'OFF', input: 'check' },
    { id: 'pl-18', num: '18', item: 'Request taxi', action: 'Permission granted', input: 'check' },
    { id: 'pl-19', num: '19', item: 'SATCOM-B', action: 'OFF', input: 'check' },
    { id: 'pl-20', num: '20', item: 'Engine Off', action: 'Time:', input: 'time' },
    { id: 'pl-21', num: '21', item: 'SPC Logs Record', action: 'Stop Recording', input: 'check' },
    { id: 'pl-22', num: '22', item: 'Remaining fuel (sensor)', action: 'GCS front panel', input: 'number' },
    { id: 'pl-23', num: '23', item: 'Remaining fuel (integrated)', action: 'Platform status', input: 'number' },
    { id: 'pl-24', num: '24', item: 'EPU', action: 'Connected', input: 'check' },
    { id: 'pl-25', num: '25', item: '', action: 'Check Batteries Charging', input: 'check' },
    { id: 'pl-26', num: '26', item: 'Battery status', action: 'Check Batteries SOC>90%', input: 'check' },
    { id: 'pl-27', num: '27', item: 'Lights', action: 'Nav and land OFF', input: 'check' },
    { id: 'pl-28', num: '28', item: 'Post Flight Walk-around', action: 'Begin', input: 'check' },
    { id: 'pl-29', num: '29', item: 'Time info panel', action: 'Stop Mission', input: 'check' },
    { id: 'pl-30', num: '30', item: 'Screen Recorder', action: 'Stop Recording', input: 'check' },
    { id: 'pl-31', num: '31', item: 'Download Data', action: 'Gimbal & Radar', input: 'check' },
    { id: 'pl-32', num: '32', item: 'Post-Flight Walkaround', action: 'Complete', input: 'check' },
    { id: 'pl-33', num: '33', item: '', action: 'Observations:', input: 'text' },
    { id: 'pl-34', num: '34', item: 'Aircraft OFF', action: 'BMS Switches: Critical and Non-Critical Off', input: 'check' },
    { id: 'pl-35', num: '35', item: 'Birdfinder', action: 'Remove and charge device', input: 'check' },
  ];

  return <ChecklistTable title="Pre-Landing Checklist (1–35)" rows={rows} getStr={getStr} getBool={getBool} update={update} />;
}

/* ────────────────────────────────────────────────
   HANDOVER — Pilot Handover — Page 12
──────────────────────────────────────────────── */
const HANDOVER_ROWS = 5; // pairs of Handling / Relieving

function HandoverTab({ getStr, update }: { getStr: (k: string) => string; update: (k: string, v: FieldValue) => void }) {
  return (
    <div className="space-y-6">
      {/* Mission Info */}
      <div>
        <h4 className="text-white font-black text-sm mb-3">Mission Information</h4>
        <table className="w-full text-xs border-collapse">
          <tbody>
            {(
              [
                { id: 'mission-details', label: 'Mission Details', hint: 'Callsign / Airspace Deconfliction / Objective / MET / RTB Time' },
                { id: 'airspace-active', label: 'Airspace Active', hint: '' },
                { id: 'time-deactivated', label: 'Time Deactivated', hint: '' },
                { id: 'aircraft-status', label: 'Aircraft Status', hint: 'System Config / Engine Parameters / Fuel & Bingo / Limitations' },
                { id: 'comms-status', label: 'Communication Status', hint: 'Datalinks / AWS / LOS Range / Serviceability' },
              ] as { id: string; label: string; hint: string }[]
            ).map(row => (
              <tr key={row.id} className="bg-slate-800">
                <td className="border border-slate-600 px-3 py-2 text-red-400 font-bold w-44 align-top">
                  {row.label}
                </td>
                <td className="border border-slate-600 p-1">
                  <input
                    type="text"
                    value={getStr(`ho-${row.id}`)}
                    onChange={e => update(`ho-${row.id}`, e.target.value)}
                    placeholder={row.hint || '—'}
                    className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded placeholder-slate-600 italic"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Crew Details */}
      <div>
        <h4 className="text-white font-black text-sm mb-3">Crew Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-700">
                <th className="border border-slate-600 px-3 py-2 text-white font-bold w-32">Crew Details</th>
                <th className="border border-slate-600 px-3 py-2 text-white font-bold">Name</th>
                <th className="border border-slate-600 px-3 py-2 text-white font-bold w-28">Time of Change</th>
                <th className="border border-slate-600 px-3 py-2 text-white font-bold">Remarks</th>
                <th className="border border-slate-600 px-3 py-2 text-white font-bold w-28">Signature</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: HANDOVER_ROWS }, (_, i) => (
                ['Handling Pilot', 'Relieving Pilot'] as const
              ).map((role, j) => {
                const rowId = `crew-${i}-${j}`;
                return (
                  <tr key={rowId} className="bg-slate-800">
                    <td className="border border-slate-600 px-3 py-1 text-white font-semibold">{role}</td>
                    {(['name', 'time', 'remarks', 'signature'] as const).map(field => (
                      <td key={field} className="border border-slate-600 p-0.5">
                        <input
                          type="text"
                          value={getStr(`ho-${rowId}-${field}`)}
                          onChange={e => update(`ho-${rowId}-${field}`, e.target.value)}
                          className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                );
              }).flat())}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observations */}
      <div>
        <h4 className="text-white font-black text-sm mb-3">Observations</h4>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border border-slate-600 px-3 py-2 text-white font-bold">Observations</th>
              <th className="border border-slate-600 px-3 py-2 text-white font-bold w-28">Date</th>
              <th className="border border-slate-600 px-3 py-2 text-white font-bold w-24">Time</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map(i => (
              <tr key={i} className="bg-slate-800">
                {i === 0 ? (
                  <td className="border border-slate-600 p-1" rowSpan={2}>
                    <textarea
                      value={getStr('ho-observations')}
                      onChange={e => update('ho-observations', e.target.value)}
                      rows={5}
                      className="w-full bg-transparent text-white text-xs px-2 py-1 focus:outline-none focus:bg-slate-700 rounded resize-none"
                      placeholder="Observations…"
                    />
                  </td>
                ) : null}
                <td className="border border-slate-600 p-0.5">
                  <input
                    type="date"
                    value={getStr(`ho-obs-date-${i}`)}
                    onChange={e => update(`ho-obs-date-${i}`, e.target.value)}
                    className="w-full bg-transparent text-white text-xs px-2 py-1 focus:outline-none focus:bg-slate-700 rounded"
                  />
                </td>
                <td className="border border-slate-600 p-0.5">
                  <input
                    type="time"
                    value={getStr(`ho-obs-time-${i}`)}
                    onChange={e => update(`ho-obs-time-${i}`, e.target.value)}
                    className="w-full bg-transparent text-white text-xs px-2 py-1 focus:outline-none focus:bg-slate-700 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RPIC sign-off */}
      <RpicSignRow prefix="ho" getStr={getStr} update={update} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   POST-FLIGHT — Documentation Review — Page 13
──────────────────────────────────────────────── */
const POST_FLIGHT_CHECKS = [
  { id: 'pf-all-completed', label: 'All checklist items completed and verified' },
  { id: 'pf-all-filled', label: 'All fields filled in (no blank mandatory items)' },
  { id: 'pf-reviewed', label: 'NOC reviewed for completeness and coherence' },
];

function PostFlightTab({
  getBool,
  getStr,
  update,
}: {
  getBool: (k: string) => boolean;
  getStr: (k: string) => string;
  update: (k: string, v: FieldValue) => void;
}) {
  return (
    <div className="space-y-6">
      <h4 className="text-white font-black text-sm">Post-Flight Documentation Review</h4>

      {/* Checkboxes */}
      <div className="border border-slate-600 rounded overflow-hidden">
        {POST_FLIGHT_CHECKS.map(item => (
          <label
            key={item.id}
            className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/30 cursor-pointer"
          >
            <span className={`text-sm ${getBool(item.id) ? 'text-slate-500 line-through' : 'text-white'}`}>
              {item.label}
            </span>
            <input
              type="checkbox"
              checked={getBool(item.id)}
              onChange={e => update(item.id, e.target.checked)}
              className="w-5 h-5 accent-red-500 cursor-pointer flex-shrink-0"
            />
          </label>
        ))}
      </div>

      {/* Confirmation statement */}
      <div className="bg-slate-900/60 border border-slate-700 rounded p-4">
        <p className="text-slate-300 text-xs italic leading-relaxed">
          I confirm that this Normal Operations Checklist has been fully completed, reviewed, and accurately reflects the
          conduct of this mission.
        </p>
      </div>

      {/* RPIC sign-off */}
      <RpicSignRow prefix="postflight" getStr={getStr} update={update} />
    </div>
  );
}

/* ────────────────────────────────────────────────
   Shared RPIC signature row
──────────────────────────────────────────────── */
function RpicSignRow({
  prefix,
  getStr,
  update,
}: {
  prefix: string;
  getStr: (k: string) => string;
  update: (k: string, v: FieldValue) => void;
}) {
  return (
    <table className="w-full text-xs border-collapse">
      <tbody>
        <tr className="bg-slate-800">
          <td className="border border-slate-600 px-3 py-2 text-white font-bold w-16">RPIC</td>
          <td className="border border-slate-600 p-0.5 w-40">
            <input
              type="text"
              value={getStr(`${prefix}-rpic-name`)}
              onChange={e => update(`${prefix}-rpic-name`, e.target.value)}
              placeholder="Name"
              className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
            />
          </td>
          <td className="border border-slate-600 px-3 py-2 text-slate-400 text-xs w-12">Sign:</td>
          <td className="border border-slate-600 p-0.5">
            <input
              type="text"
              value={getStr(`${prefix}-rpic-sign`)}
              onChange={e => update(`${prefix}-rpic-sign`, e.target.value)}
              className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
            />
          </td>
          <td className="border border-slate-600 px-3 py-2 text-slate-400 text-xs w-12">Date:</td>
          <td className="border border-slate-600 p-0.5 w-36">
            <input
              type="date"
              value={getStr(`${prefix}-rpic-date`)}
              onChange={e => update(`${prefix}-rpic-date`, e.target.value)}
              className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
