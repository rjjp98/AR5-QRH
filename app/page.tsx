'use client';

import { useState, useRef, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  type: 'checkbox' | 'text' | 'number';
}

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  items: ChecklistItem[];
}

interface ChecklistData {
  templateId: string;
  data: Record<string, string | boolean>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('checklists');
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [savedChecklists, setSavedChecklists] = useState<ChecklistData[]>([]);
  const [isClient, setIsClient] = useState(false);

  // NOC Checklist Template
  const nocTemplate: ChecklistTemplate = {
    id: 'noc',
    name: 'NOC - Normal Operations Checklist',
    description: 'Normal Operations Checklist para o AR5 MK3',
    items: [
      // PRE-FLIGHT CHECKS
      { id: 'noc-1', label: 'Aircraft exterior inspection completed', type: 'checkbox' },
      { id: 'noc-2', label: 'Flight controls checked and free', type: 'checkbox' },
      { id: 'noc-3', label: 'Fuel quantity verified', type: 'checkbox' },
      { id: 'noc-4', label: 'Engine oil level verified', type: 'checkbox' },
      { id: 'noc-5', label: 'Landing gear inspection completed', type: 'checkbox' },
      { id: 'noc-6', label: 'Battery voltage checked', type: 'checkbox' },
      { id: 'noc-7', label: 'Avionics systems verified', type: 'checkbox' },
      { id: 'noc-8', label: 'Weight and balance calculated', type: 'text' },
      
      // ENGINE START
      { id: 'noc-9', label: 'Engine start sequence initiated', type: 'checkbox' },
      { id: 'noc-10', label: 'Engine instruments in green', type: 'checkbox' },
      { id: 'noc-11', label: 'Oil temperature normal', type: 'checkbox' },
      { id: 'noc-12', label: 'Oil pressure normal', type: 'checkbox' },
      
      // TAXI
      { id: 'noc-13', label: 'Flight surfaces responsive', type: 'checkbox' },
      { id: 'noc-14', label: 'Brakes tested', type: 'checkbox' },
      { id: 'noc-15', label: 'Navigation lights on', type: 'checkbox' },
      
      // TAKEOFF
      { id: 'noc-16', label: 'Runway clear', type: 'checkbox' },
      { id: 'noc-17', label: 'Flight plan filed', type: 'checkbox' },
      { id: 'noc-18', label: 'Transponder set to flight plan', type: 'checkbox' },
      
      // FLIGHT
      { id: 'noc-19', label: 'Cruise altitude reached', type: 'number' },
      { id: 'noc-20', label: 'Heading verified', type: 'number' },
      
      // LANDING
      { id: 'noc-21', label: 'Landing gear down and locked', type: 'checkbox' },
      { id: 'noc-22', label: 'Flight surfaces configured for landing', type: 'checkbox' },
      { id: 'noc-23', label: 'Landing clearance received', type: 'checkbox' },
      
      // POST-FLIGHT
      { id: 'noc-24', label: 'Aircraft parked and secured', type: 'checkbox' },
      { id: 'noc-25', label: 'Engine shutdown procedure completed', type: 'checkbox' },
      { id: 'noc-26', label: 'Flight log updated', type: 'checkbox' },
    ],
  };

  const checklistTemplates: ChecklistTemplate[] = [nocTemplate];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedChecklist(null);
    setFormData({});
  };

  const handleChecklistSelect = (checklistId: string) => {
    setSelectedChecklist(checklistId);
    setFormData({});
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveChecklist = () => {
    if (!selectedChecklist) return;
    
    const newSavedChecklist: ChecklistData = {
      templateId: selectedChecklist,
      data: formData,
    };
    
    setSavedChecklists([...savedChecklists, newSavedChecklist]);
    alert('Checklist guardado com sucesso!');
    setSelectedChecklist(null);
    setFormData({});
  };

  const handleExportPDF = async () => {
    if (!selectedChecklist) return;
    
    try {
      const html2pdf = await import('html2pdf.js');
      const element = document.getElementById('checklist-content');
      
      if (!element) return;
      
      const opt = {
        margin: 5,
        filename: `AR5_Checklist_${new Date().toISOString().split('T')[0]}.pdf`,
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

  const currentTemplate = checklistTemplates.find((t) => t.id === selectedChecklist);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AR5 MK3 QRH</h1>
              <p className="text-slate-400 text-sm">Quick Reference Handbook</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 font-semibold">Tekever Flight Operations</p>
              <p className="text-slate-500 text-xs">Flight Operations Commander</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange('checklists')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'checklists'
                  ? 'text-red-500 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              ✓ Checklists
            </button>
            <button
              onClick={() => handleTabChange('saved')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'saved'
                  ? 'text-red-500 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              📋 Saved Data
            </button>
            <button
              onClick={() => handleTabChange('help')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'help'
                  ? 'text-red-500 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              ℹ️ Help
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Checklists Tab */}
        {activeTab === 'checklists' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Checklist Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sticky top-20">
                <h2 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Checklists</h2>
                <div className="space-y-2">
                  {checklistTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleChecklistSelect(template.id)}
                      className={`w-full text-left px-4 py-3 rounded transition ${
                        selectedChecklist === template.id
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-semibold">{template.name}</div>
                      <div className="text-xs opacity-75">{template.items.length} items</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist Content */}
            <div className="lg:col-span-3">
              {selectedChecklist && currentTemplate ? (
                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-black text-white mb-2">{currentTemplate.name}</h2>
                    <p className="text-slate-400 text-sm">{currentTemplate.description}</p>
                  </div>

                  {/* Checklist Items */}
                  <div id="checklist-content" className="p-6">
                    <div className="space-y-3">
                      {currentTemplate.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
                        >
                          <span className="text-red-500 font-bold min-w-[30px]">{idx + 1}.</span>
                          <span className="text-slate-200 flex-1">{item.label}</span>
                          
                          {item.type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={(formData[item.id] as boolean) || false}
                              onChange={(e) => handleInputChange(item.id, e.target.checked)}
                              className="w-5 h-5 rounded cursor-pointer accent-red-500"
                            />
                          ) : (
                            <input
                              type={item.type}
                              placeholder={item.type === 'number' ? '0' : 'Enter value'}
                              value={(formData[item.id] as string) || ''}
                              onChange={(e) => handleInputChange(item.id, e.target.value)}
                              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 text-sm w-32"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-slate-700/50 border-t border-slate-700 p-6 flex gap-3 justify-end">
                    <button
                      onClick={handleExportPDF}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                    >
                      📥 Export PDF
                    </button>
                    <button
                      onClick={handleSaveChecklist}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                    >
                      💾 Save Checklist
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                  <p className="text-slate-400 text-lg">Seleciona um checklist para começar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saved Data Tab */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Saved Checklists</h2>
            {savedChecklists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedChecklists.map((saved, idx) => {
                  const template = checklistTemplates.find((t) => t.id === saved.templateId);
                  return (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-white font-bold mb-2">{template?.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">
                        {Object.keys(saved.data).length} fields filled
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('checklists');
                          handleChecklistSelect(saved.templateId);
                          setFormData(saved.data);
                        }}
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition"
                      >
                        View & Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                <p className="text-slate-400">No saved checklists yet</p>
              </div>
            )}
          </div>
        )}

        {/* Help Tab */}
        {activeTab === 'help' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h2 className="text-2xl font-black text-white mb-6">How to Use</h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-red-500 font-bold mb-2">1. Select a Checklist</h3>
                <p>Choose from the available checklists on the left sidebar.</p>
              </div>
              <div>
                <h3 className="text-red-500 font-bold mb-2">2. Fill the Checklist</h3>
                <p>Complete all items by checking boxes or entering required information.</p>
              </div>
              <div>
                <h3 className="text-red-500 font-bold mb-2">3. Save or Export</h3>
                <p>Save your data for later or export as PDF for printing.</p>
              </div>
              <div>
                <h3 className="text-red-500 font-bold mb-2">4. Access Saved Data</h3>
                <p>View all your saved checklists in the "Saved Data" tab.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6 text-center text-slate-600 text-xs">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations | Confidential</p>
      </footer>
    </div>
  );
}
