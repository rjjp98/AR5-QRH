'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import html2pdf from 'html2pdf.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChecklistField {
  id: string;
  label: string;
  type: 'checkbox' | 'text' | 'number';
  section: string;
  value: string | boolean;
}

export default function NOC() {
  const [activeTab, setActiveTab] = useState('noc');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [checklist, setChecklist] = useState<ChecklistField[]>([]);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const parseChecklistFromPDF = async (file: File) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const extractedFields: ChecklistField[] = [];
      let fieldId = 0;

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');

        // Parse checklist items (basic parsing for common patterns)
        // Looking for patterns like "123 Item Name" or "- Item Name"
        const lines = text.split(/\n|\r/);
        let currentSection = 'General';

        for (const line of lines) {
          const trimmed = line.trim();
          
          // Detect section headers
          if (trimmed.match(/^(PRE-FLIGHT|ENGINE START|TAXI|TAKEOFF|PRE-LANDING|POST-FLIGHT|FLIGHT CHECKS|PILOT HANDOVER)/i)) {
            currentSection = trimmed;
          }

          // Detect checklist items (number followed by text)
          const itemMatch = trimmed.match(/^(\d+[a-z]?|\-)\s+(.+?)(\s+(\(.*?\)|\[.*?\]|\d+))?$/);
          if (itemMatch && trimmed.length > 3) {
            const label = itemMatch[2].trim();
            if (label.length > 2) {
              extractedFields.push({
                id: `field_${fieldId++}`,
                label: label,
                type: 'checkbox',
                section: currentSection,
                value: false,
              });
            }
          }
        }
      }

      if (extractedFields.length === 0) {
        alert('Não consegui extrair campos do PDF. Tenta com um PDF diferente.');
        setIsProcessing(false);
        return;
      }

      // Remove duplicates
      const uniqueFields = Array.from(
        new Map(extractedFields.map((f) => [f.label, f])).values()
      );

      setChecklist(uniqueFields);
      setPdfName(file.name);
      setPdfLoaded(true);
      setFormData({}); // Reset form data
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      alert('Erro ao processar PDF. Tenta novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      parseChecklistFromPDF(file);
    } else {
      alert('Por favor seleciona um ficheiro PDF válido.');
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('noc-content');
    if (!element) return;

    const opt = {
      margin: 5,
      filename: `AR5_NOC_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const groupedChecklist = checklist.reduce(
    (acc, field) => {
      if (!acc[field.section]) {
        acc[field.section] = [];
      }
      acc[field.section].push(field);
      return acc;
    },
    {} as Record<string, ChecklistField[]>
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
          <div className="text-white max-w-5xl mx-auto">
            {!pdfLoaded ? (
              // PDF Upload Section
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-8 shadow-2xl text-center">
                  <h2 className="text-3xl font-black text-cyan-400 mb-4">UPLOAD CHECKLIST PDF</h2>
                  <p className="text-slate-300 mb-8">
                    Carrega o teu ficheiro PDF de checklist e vamos extrair todos os campos automaticamente.
                    <br />
                    Podes atualizar o PDF sempre que quiseres!
                  </p>

                  <div
                    className="border-2 border-dashed border-cyan-500/50 rounded-xl p-12 mb-6 hover:border-cyan-500 hover:bg-cyan-500/5 transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-xl font-bold text-cyan-400 mb-2">Clica ou arrasta um PDF</p>
                    <p className="text-slate-400">Suportamos ficheiros PDF até 50MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {isProcessing && (
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                      <p className="text-slate-300 mt-3">A processar PDF...</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-4">
                    O sistema irá extrair todos os itens de checklist do PDF automaticamente
                  </p>
                </div>

                {/* Info Section */}
                <div className="bg-gradient-to-br from-red-600/8 to-red-600/3 backdrop-blur-2xl border border-red-600/30 rounded-xl p-8 shadow-2xl">
                  <h3 className="text-xl font-black text-red-400 mb-4">🎯 Como Funciona</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex gap-3">
                      <span className="text-red-500 font-bold">1.</span>
                      <span>Faz upload do teu PDF de checklist</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500 font-bold">2.</span>
                      <span>O sistema extrai automaticamente todos os campos</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500 font-bold">3.</span>
                      <span>Preenche os campos no formulário interativo</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500 font-bold">4.</span>
                      <span>Exporta um PDF com todos os dados preenchidos</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500 font-bold">5.</span>
                      <span>Quando houver updates, carrega o novo PDF e pronto! 🚀</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // Checklist Form Section
              <div>
                {/* Header with PDF info and Export buttons */}
                <div className="mb-6 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-cyan-400">📄 {pdfName}</h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {checklist.length} campos extraídos • {Object.keys(groupedChecklist).length} secções
                      </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition text-sm"
                      >
                        🔄 NOVO PDF
                      </button>
                      <button
                        onClick={exportPDF}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition text-sm"
                      >
                        📥 EXPORT PDF
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg shadow-lg transition text-sm"
                      >
                        🖨️ PRINT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hidden input for file upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Checklist Content */}
                <div id="noc-content" className="space-y-6">
                  {Object.entries(groupedChecklist).map(([section, fields]) => (
                    <div
                      key={section}
                      className="bg-gradient-to-br from-cyan-600/8 to-cyan-600/3 backdrop-blur-2xl border border-cyan-600/30 rounded-xl p-6 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4 sticky top-24 z-20 bg-black/50 -mx-6 px-6 py-2 rounded-t-xl">
                        <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                        <h2 className="text-lg font-black text-cyan-400">{section}</h2>
                        <span className="ml-auto text-xs text-cyan-400 font-bold bg-cyan-500/20 px-3 py-1 rounded">
                          {fields.length} itens
                        </span>
                      </div>

                      <div className="space-y-2">
                        {fields.map((field, idx) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-3 py-2 px-3 border-b border-slate-700/30 hover:bg-white/5 transition group"
                          >
                            <span className="text-cyan-400 font-bold min-w-[30px] text-sm">
                              {idx + 1}
                            </span>
                            <span className="text-slate-200 text-sm flex-1 group-hover:text-cyan-300 transition">
                              {field.label}
                            </span>
                            {field.type === 'checkbox' ? (
                              <input
                                type="checkbox"
                                checked={
                                  (formData[field.id] as boolean) || false
                                }
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.checked)
                                }
                                className="w-4 h-4 cursor-pointer accent-red-500"
                              />
                            ) : (
                              <input
                                type={field.type}
                                placeholder="Valor"
                                value={
                                  (formData[field.id] as string) || ''
                                }
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                className="px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white placeholder-slate-500 text-xs w-24"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Final Signature Section */}
                  <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
                    <h2 className="text-lg font-black text-cyan-400 mb-4">ASSINATURA & FINALIZAÇÃO</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-cyan-400 text-xs font-bold">Data</label>
                        <input
                          type="date"
                          value={
                            (formData['final_date'] as string) || ''
                          }
                          onChange={(e) =>
                            handleInputChange('final_date', e.target.value)
                          }
                          className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-cyan-400 text-xs font-bold">Hora</label>
                        <input
                          type="time"
                          value={
                            (formData['final_time'] as string) || ''
                          }
                          onChange={(e) =>
                            handleInputChange('final_time', e.target.value)
                          }
                          className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-cyan-400 text-xs font-bold">RPIC</label>
                        <input
                          type="text"
                          placeholder="Nome"
                          value={
                            (formData['final_rpic'] as string) || ''
                          }
                          onChange={(e) =>
                            handleInputChange('final_rpic', e.target.value)
                          }
                          className="w-full px-2 py-1 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-cyan-400 text-xs font-bold">
                        Observações Finais
                      </label>
                      <textarea
                        placeholder="Observações..."
                        value={
                          (formData['final_observations'] as string) || ''
                        }
                        onChange={(e) =>
                          handleInputChange('final_observations', e.target.value)
                        }
                        className="w-full px-2 py-2 bg-white/10 border border-cyan-500/30 rounded text-white mt-1 text-xs h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'noc' && (
          <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-12 shadow-2xl text-center text-slate-300 max-w-5xl mx-auto">
            <p className="text-xl">Coming soon...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-red-600/10 mt-10 py-6 text-center text-slate-600 text-xs">
        <p>AR5 MK3 QRH © 2026 | Tekever Flight Operations | Confidential</p>
      </footer>
    </div>
  );
}
