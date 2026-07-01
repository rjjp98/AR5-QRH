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
  header: { aircraftID: '', gcs: '', tracker: '', rpic: '', mission: '' },
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
      if (saved) setData(JSON.parse(saved) as NocData);
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
          {activeTab !== 'preflight' && (
            <PlaceholderTab tab={TABS.find(t => t.id === activeTab)!} />
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
      <p className="text-slate-500 text-xs italic">
        Phase 1 skeleton — full ~80 fields will be added in Phase 2.
      </p>
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
