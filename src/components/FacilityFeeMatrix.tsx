/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FacilityFeeMatrix as MatrixType } from '../types';
import { 
  Table2, 
  Search, 
  HelpCircle, 
  DollarSign, 
  ArrowRightLeft, 
  AlertOctagon, 
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface FacilityFeeMatrixProps {
  matrix: MatrixType[];
  onUpdateMatrixRow: (updated: MatrixType) => void;
}

export default function FacilityFeeMatrix({ matrix, onUpdateMatrixRow }: FacilityFeeMatrixProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRow, setEditingRow] = useState<MatrixType | null>(null);

  // Filter
  const filteredMatrix = matrix.filter(row => 
    row.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    row.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: calculate average of a row
  const calculateRowStats = (row: MatrixType) => {
    const prices = [
      row.generalHospital,
      row.districtClinic,
      row.mercyMedical,
      row.hopeHealthCenter,
      row.nationalClinic
    ];
    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = sum / prices.length;
    
    // Find highest facility
    const maxVal = Math.max(...prices);
    let highestFac = '';
    if (maxVal === row.generalHospital) highestFac = 'General Hosp';
    else if (maxVal === row.districtClinic) highestFac = 'District Clin';
    else if (maxVal === row.mercyMedical) highestFac = 'Mercy Med';
    else if (maxVal === row.hopeHealthCenter) highestFac = 'Hope Health';
    else highestFac = 'National Clin';

    // Find lowest facility
    const minVal = Math.min(...prices);

    return { avg, maxVal, minVal, highestFac };
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRow) {
      onUpdateMatrixRow(editingRow);
      setEditingRow(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['CPT Code', 'Description', 'General Hospital', 'District Clinic', 'Mercy Medical', 'Hope Health Center', 'National Clinic'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...matrix.map(r => [
        r.code,
        r.description,
        r.generalHospital,
        r.districtClinic,
        r.mercyMedical,
        r.hopeHealthCenter,
        r.nationalClinic
      ].join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Facility_Fee_Matrix.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Facility Fee Matrix (Sheet 5)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Comparative grid matrix comparing raw charge schedules for standardized CPT codes side-by-side across major hospitals and clinics. Off-nominal rates are highlighted in red.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 text-xs rounded-lg transition shrink-0"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Matrix Sheet</span>
        </button>
      </div>

      {/* Explanatory banner */}
      <div className="bg-slate-900/30 p-4 rounded-xl border border-blue-500/10 flex items-start space-x-3">
        <HelpCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-blue-300 font-bold">Matrix Compliance Rules:</span> Cells styled with a red-filled border represent billing rates that are <span className="text-rose-450 font-bold font-mono">30% or more above</span> the row average. This facilitates rapid visual detection of uncontracted markup patterns or localized fee-gouging.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search procedure code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Cross-facility matrix table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/70 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">
                <th className="py-4 px-6 text-left w-24">CPT Code</th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-4 text-right bg-slate-950">General Hospital</th>
                <th className="py-4 px-4 text-right">District Clinic</th>
                <th className="py-4 px-4 text-right bg-slate-950">Mercy Med Center</th>
                <th className="py-4 px-4 text-right">Hope Health</th>
                <th className="py-4 px-4 text-right bg-slate-950">National Clinic</th>
                <th className="py-4 px-5 text-right text-emerald-400 border-l border-slate-800">Row Average</th>
                <th className="py-4 px-5 text-center text-rose-400">Peak Biller</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredMatrix.length > 0 ? (
                filteredMatrix.map((row) => {
                  const { avg, maxVal, highestFac } = calculateRowStats(row);

                  const renderMatrixCell = (val: number, name: string, isBg: boolean) => {
                    const deviation = ((val - avg) / avg) * 100;
                    const isEgregious = deviation >= 30;
                    return (
                      <td className={`py-3.5 px-4 text-right font-mono text-xs ${
                        isEgregious 
                          ? 'border border-rose-500/40 bg-rose-500/5 text-rose-300 font-extrabold shadow-inner' 
                          : isBg ? 'bg-slate-950 text-slate-300' : 'text-slate-300'
                      }`}>
                        ${val.toLocaleString()}
                        {isEgregious && (
                          <span className="text-[9px] text-rose-450 block font-normal font-sans tracking-tight">
                            (+{deviation.toFixed(0)}%)
                          </span>
                        )}
                      </td>
                    );
                  };

                  return (
                    <tr key={row.id} className="hover:bg-slate-900/30 transition">
                      <td className="py-3.5 px-6 font-mono font-black text-emerald-400">
                        {row.code}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">
                        {row.description}
                      </td>
                      {renderMatrixCell(row.generalHospital, 'generalHospital', true)}
                      {renderMatrixCell(row.districtClinic, 'districtClinic', false)}
                      {renderMatrixCell(row.mercyMedical, 'mercyMedical', true)}
                      {renderMatrixCell(row.hopeHealthCenter, 'hopeHealthCenter', false)}
                      {renderMatrixCell(row.nationalClinic, 'nationalClinic', true)}
                      
                      {/* Row Average */}
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-100 bg-slate-950 border-l border-slate-800">
                        ${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>

                      {/* Peak biller indicator */}
                      <td className="py-3.5 px-5 text-center text-xs">
                        <span className="inline-block bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded px-2 py-0.5 font-sans">
                          {highestFac} (${maxVal.toLocaleString()})
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setEditingRow(row)}
                          className="text-xs text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded transition"
                        >
                          Alter
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-sm">
                    No matrix rows match search bounds.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Row Modal */}
      {editingRow && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <h4 className="text-lg font-bold text-white mb-2">Configure Cross-Facility matrix multipliers</h4>
            <p className="text-slate-400 text-xs mb-4">
              Edit raw billing rates in the system spreadsheet database for code <span className="text-emerald-400 font-mono">{editingRow.code}</span>.
            </p>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-sans">Description</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingRow.description} 
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-3 py-2 text-xs text-slate-550 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm uppercase">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Gen General Hosp</label>
                  <input 
                    type="number"
                    required
                    value={editingRow.generalHospital} 
                    onChange={(e) => setEditingRow({ ...editingRow, generalHospital: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">District Clinic</label>
                  <input 
                    type="number"
                    required
                    value={editingRow.districtClinic} 
                    onChange={(e) => setEditingRow({ ...editingRow, districtClinic: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Mercy Medical</label>
                  <input 
                    type="number"
                    required
                    value={editingRow.mercyMedical} 
                    onChange={(e) => setEditingRow({ ...editingRow, mercyMedical: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Hope Health Cen</label>
                  <input 
                    type="number"
                    required
                    value={editingRow.hopeHealthCenter} 
                    onChange={(e) => setEditingRow({ ...editingRow, hopeHealthCenter: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">National Clinic</label>
                  <input 
                    type="number"
                    required
                    value={editingRow.nationalClinic} 
                    onChange={(e) => setEditingRow({ ...editingRow, nationalClinic: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800 font-sans">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded py-2 text-sm transition"
                >
                  Confirm Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded py-2 text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
