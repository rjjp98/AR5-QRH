'use client';

import { useState, useEffect } from 'react';

type NocTab = 'preflight' | 'takeoff' | 'inflight' | 'prelanding' | 'postflight' | 'hourly' | 'handover';
type FieldValue = string | boolean | number;

interface NocHeader {
  aircraftID: string;
  gcs: string;
  tracker: string;
  rpic: string;
  mission: string;
  nocVersion: string;
}

interface FlightResume {
  date: string;
  departureTime: string;
  landingTime: string;
  totalFlightTime: string;
  remarks: string;
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
  header: { aircraftID: '', gcs: '', tracker: '', rpic: '', mission: '', nocVersion: DEFAULT_NOC_VERSION },
  flightResume: { date: '', departureTime: '', landingTime: '', totalFlightTime: '', remarks: '' },
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
    const mission = data.header.mission.trim() || 'UNKNOWN_MISSION';
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

  const headerFields: { key: keyof NocHeader; label: string }[] = [
    { key: 'nocVersion', label: 'NOC Version' },
    { key: 'aircraftID', label: 'Aircraft ID' },
    { key: 'gcs', label: 'GCS' },
    { key: 'tracker', label: 'Tracker' },
    { key: 'rpic', label: 'RPIC' },
    { key: 'mission', label: 'Mission' },
  ];

  const resumeFields: { key: keyof FlightResume; label: string; type: string }[] = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'departureTime', label: 'Departure (UTC)', type: 'time' },
    { key: 'landingTime', label: 'Landing (UTC)', type: 'time' },
    { key: 'totalFlightTime', label: 'Total FT (hh:mm)', type: 'text' },
    { key: 'remarks', label: 'Remarks', type: 'text' },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {headerFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">
                {label}
              </label>
              <input
                type="text"
                value={data.header[key]}
                onChange={e => updateHeader(key, e.target.value)}
                placeholder={label}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Flight Resume ── */}
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h3 className="text-base font-black text-white uppercase tracking-wide mb-4">
          Flight Resume
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {resumeFields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs font-semibold uppercase mb-1">
                {label}
              </label>
              <input
                type={type}
                value={data.flightResume[key]}
                onChange={e => updateFlightResume(key, e.target.value)}
                placeholder={type === 'text' ? label : undefined}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
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
            <TakeOffTab getStr={getStr} update={updateField} />
          )}
          {activeTab === 'inflight' && (
            <InFlightTab getStr={getStr} update={updateField} />
          )}
          {activeTab === 'prelanding' && (
            <PlaceholderTab tab={TABS.find(t => t.id === 'prelanding')!} />
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
   Placeholder for tabs not yet implemented
──────────────────────────────────────────────── */
function PlaceholderTab({ tab }: { tab: { label: string; icon: string } }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-500">
      <div className="text-center">
        <div className="text-5xl mb-4">{tab.icon}</div>
        <p className="font-black text-lg text-white">{tab.label}</p>
        <p className="text-sm mt-2 text-slate-400">Coming in Phase 2 / 3</p>
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
  getNum: (key: string) => number | '';
  update: (key: string, value: FieldValue) => void;
}

type ItemDef =
  | { id: string; type: 'checkbox'; label: string }
  | { id: string; type: 'number'; label: string; unit?: string }
  | { id: string; type: 'text'; label: string };

interface Section {
  title: string;
  items: ItemDef[];
}

function PreFlightTab({ getStr, getBool, getNum, update }: FieldProps) {
  const sections: Section[] = [
    {
      title: 'A. Documentation & Authorisations',
      items: [
        { id: 'pf-doc-1', type: 'checkbox', label: 'Flight authorisation received' },
        { id: 'pf-doc-2', type: 'checkbox', label: 'NOTAMs checked' },
        { id: 'pf-doc-3', type: 'checkbox', label: 'Weather briefing completed' },
        { id: 'pf-doc-4', type: 'text', label: 'Weather remarks' },
      ],
    },
    {
      title: 'B. Aircraft',
      items: [
        { id: 'pf-ac-1', type: 'checkbox', label: 'Aircraft configuration verified' },
        { id: 'pf-ac-2', type: 'number', label: 'Fuel quantity', unit: 'L' },
        { id: 'pf-ac-3', type: 'checkbox', label: 'MEL checked — no open items' },
        { id: 'pf-ac-4', type: 'text', label: 'Defect / MEL notes' },
      ],
    },
    {
      title: 'C. Ground Equipment',
      items: [
        { id: 'pf-ge-1', type: 'checkbox', label: 'GCS powered and operational' },
        { id: 'pf-ge-2', type: 'checkbox', label: 'Tracker powered and linked' },
        { id: 'pf-ge-3', type: 'checkbox', label: 'Comms established' },
        { id: 'pf-ge-4', type: 'text', label: 'Equipment remarks' },
      ],
    },
    {
      title: 'D. Crew',
      items: [
        { id: 'pf-cr-1', type: 'checkbox', label: 'RPIC briefed' },
        { id: 'pf-cr-2', type: 'checkbox', label: 'Observer(s) in position' },
        { id: 'pf-cr-3', type: 'text', label: 'Crew remarks' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title}>
          <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-3 pb-1 border-b border-slate-700">
            {section.title}
          </h4>
          <div className="space-y-1">
            {section.items.map(item => (
              <FieldRow key={item.id} item={item} getStr={getStr} getBool={getBool} getNum={getNum} update={update} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldRow({ item, getStr, getBool, getNum, update }: { item: ItemDef } & FieldProps) {
  if (item.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-700/40 cursor-pointer group border-b border-slate-700/40">
        <input
          type="checkbox"
          checked={getBool(item.id)}
          onChange={e => update(item.id, e.target.checked)}
          className="w-5 h-5 accent-red-500 cursor-pointer flex-shrink-0"
        />
        <span
          className={`text-sm select-none ${getBool(item.id) ? 'text-slate-500 line-through' : 'text-white group-hover:text-slate-200'}`}
        >
          {item.label}
        </span>
        {getBool(item.id) && <span className="ml-auto text-green-500 text-xs font-bold">✓</span>}
      </label>
    );
  }

  if (item.type === 'number') {
    return (
      <div className="flex items-center gap-3 py-2 px-2 border-b border-slate-700/40">
        <span className="text-white text-sm flex-1">{item.label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={getNum(item.id)}
            onChange={e => update(item.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm w-24 focus:outline-none focus:border-red-500 text-right"
            placeholder="—"
          />
          {item.unit && <span className="text-slate-400 text-xs w-6">{item.unit}</span>}
        </div>
      </div>
    );
  }

  // text
  return (
    <div className="flex items-center gap-3 py-2 px-2 border-b border-slate-700/40">
      <span className="text-slate-300 text-sm w-40 flex-shrink-0">{item.label}</span>
      <input
        type="text"
        value={getStr(item.id)}
        onChange={e => update(item.id, e.target.value)}
        placeholder="—"
        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-red-500"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────
   TAKE-OFF — NOC page alignment (rows 80–97)
──────────────────────────────────────────────── */
function TakeOffTab({ getStr, update }: { getStr: (k: string) => string; update: (k: string, v: FieldValue) => void }) {
  const remarksInput = (key: string) => (
    <input
      type="text"
      value={getStr(key)}
      onChange={e => update(key, e.target.value)}
      className="w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:bg-slate-700 rounded"
      placeholder="Remarks"
    />
  );

  return (
    <div className="space-y-4">
      <h4 className="text-white font-black text-sm">Before Take-off</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[980px]">
          <tbody>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold w-14">80</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold w-44">Roll Right</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">
                Check Left Aileron Up/ Right Aileron Down/ Lidar Increase / Instruments
              </td>
              <td className="border border-slate-600 p-1 w-40">{remarksInput('to-80')}</td>
            </tr>
            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">81</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Pitot</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Remove cover</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-81')}</td>
            </tr>

            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">82</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold" rowSpan={3}>
                Airspeed Test
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">
                Check EKF Table for Instance in use — Airspeed 1 test
              </td>
              <td className="border border-slate-600 p-1">{remarksInput('to-82')}</td>
            </tr>
            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">83</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Airspeed 2 test</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-83')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">84</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Airspeed 3 test</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-84')}</td>
            </tr>

            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">85</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Mode Manual</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Change</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-85')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">86</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">RC receivers Availability</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Check 2 receivers available</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-86')}</td>
            </tr>

            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold" rowSpan={2}>87</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold leading-relaxed" rowSpan={2}>
                Weather Conditions Limits:
                <br />→ Headwind ≤25kts (gusts 30)
                <br />→ Crosswind ≤14kts (gusts 17)
                <br />→ Cruise ≤35kts
                <br />→ Tailwind ≤5kts
                <br />→ Temp -10–40°C
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Check &amp; log PT - IPMA</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-87-pt')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">
                Check &amp; log ES - AEMET (if Cross Border Flight)
              </td>
              <td className="border border-slate-600 p-1">{remarksInput('to-87-es')}</td>
            </tr>

            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">88</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Runway</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Check runway and take-off direction</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-88')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">89</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Payload Configuration</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Confirm payload config/status. Observations:</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-89')}</td>
            </tr>
            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">90</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Gimbal</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Set to PROTECT</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-90')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">91</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">SAR / VIDAR</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">ON and confirm PROTECT mode</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-91')}</td>
            </tr>

            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold" rowSpan={9}>92</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold leading-relaxed" rowSpan={9}>
                Routes
                <br />
                1. Read
                <br />
                If needed:
                <br />
                1. Load,
                <br />
                2. Write
                <br />
                3. Read
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Mission Loaded</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-92-1')}</td>
            </tr>
            {[
              'Prepare Take-off Set',
              'Loiter radius min 250m',
              'CW or CCW',
              'WP radius 100',
              'Prepare Landing Set',
              'LANDING Waypoint Set',
              'Lock Heading',
              'Check loaded Rally points',
            ].map((line, idx) => (
              <tr key={`to-92-${idx + 2}`} className={idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/60'}>
                <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">{line}</td>
                <td className="border border-slate-600 p-1">{remarksInput(`to-92-${idx + 2}`)}</td>
              </tr>
            ))}

            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">93</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Transponder</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Switch ON</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-93')}</td>
            </tr>
            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">94</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Flight ID</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Set Flight ID (TEK01/02)</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-94')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">95</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Aircraft Address</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Set Aircraft Address</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-95')}</td>
            </tr>
            <tr className="bg-slate-800/60">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">96</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">Squawk Code</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Set VFR Squawk (A5656)</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-96')}</td>
            </tr>
            <tr className="bg-slate-800">
              <td className="border border-slate-600 px-2 py-2 text-center text-red-400 font-bold">97</td>
              <td className="border border-slate-600 px-3 py-2 text-white font-bold">ACS Mode</td>
              <td className="border border-slate-600 px-3 py-2 text-slate-200 text-center">Set STANDBY on ground</td>
              <td className="border border-slate-600 p-1">{remarksInput('to-97')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
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
