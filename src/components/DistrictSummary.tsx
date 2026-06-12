/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DistrictSummary as DistrictType } from '../types';
import { 
  Building2, 
  Map, 
  Search, 
  ArrowUpDown, 
  DollarSign, 
  Percent, 
  ShieldAlert, 
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';

interface DistrictSummaryProps {
  districts: DistrictType[];
  onUpdateDistrict: (updated: DistrictType) => void;
}

export default function DistrictSummary({ districts, onUpdateDistrict }: DistrictSummaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DistrictType>('claimsSubmitted');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<DistrictType | null>(null);

  // Sorting
  const toggleSort = (field: keyof DistrictType) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedDistricts = [...districts]
    .filter(d => d.districtName.toLowerCase().includes(searchTerm.toLowerCase()) || d.districtId.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  // Totals Calculations
  const totalSubmitted = districts.reduce((sum, current) => sum + current.claimsSubmitted, 0);
  const totalApproved = districts.reduce((sum, current) => sum + current.claimsApproved, 0);
  const totalValue = districts.reduce((sum, current) => sum + current.claimValue, 0);
  const totalRejections = districts.reduce((sum, current) => sum + current.auditRejections, 0);
  const totalLeakagePrevented = districts.reduce((sum, current) => sum + current.leakagePrevented, 0);
  const averageErrorRate = parseFloat(
    (districts.reduce((sum, current) => sum + current.errorRate, 0) / districts.length).toFixed(2)
  );

  // Simulation of custom file edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDistrict) {
      // Auto-recalculate error rate based on rejections vs claim value
      const calculatedErrorStr = ((editingDistrict.auditRejections / editingDistrict.claimValue) * 100).toFixed(2);
      const calculatedErrorVal = parseFloat(calculatedErrorStr) || 0;
      onUpdateDistrict({
        ...editingDistrict,
        errorRate: calculatedErrorVal
      });
      setEditingDistrict(null);
    }
  };

  // Simulate exporting sheet to CSV
  const handleExportCSV = () => {
    const headers = ['District ID', 'District Name', 'Claims Submitted', 'Claims Approved', 'Claim Value ($)', 'Audit Rejections ($)', 'Error Rate (%)', 'Leakage Prevented ($)'];
    const rows = districts.map(d => [
      d.districtId,
      d.districtName,
      d.claimsSubmitted,
      d.claimsApproved,
      d.claimValue,
      d.auditRejections,
      d.errorRate,
      d.leakagePrevented
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "District_Summary_Sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Intro and Overview card */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">District Summary Sheet (Sheet 2)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Aggregated regional statistics summarizing claim volume, rejection metrics, calculated error frequencies, and systemic auditing yield.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs leading-none text-slate-300 hover:bg-slate-850 hover:text-white transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Sheet (.CSV)</span>
        </button>
      </div>

      {/* District aggregations metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Claims Evaluated Value</span>
            <h4 className="text-xl font-bold text-slate-200 mt-1">${totalValue.toLocaleString()}</h4>
            <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">Across six main clinical regions</span>
          </div>
          <Building2 className="h-8 w-8 text-slate-700" />
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Aggregated Saved Leakage</span>
            <h4 className="text-xl font-bold text-emerald-400 mt-1">${totalLeakagePrevented.toLocaleString()}</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 inline-block">Recovered / Prevented in pipeline</span>
          </div>
          <ShieldCheck className="h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Average District Error Frequency</span>
            <h4 className="text-xl font-bold text-orange-400 mt-1">{averageErrorRate}%</h4>
            <span className="text-[10px] text-slate-400 mt-0.5 inline-block">Standard regional billing variation</span>
          </div>
          <ShieldAlert className="h-8 w-8 text-orange-500/20" />
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search district name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono hidden sm:block">
          Displaying {sortedDistricts.length} regions of interest
        </div>
      </div>

      {/* District Comparison Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('districtName')}>
                  <div className="flex items-center space-x-1 justify-between">
                    <span>District Name</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('claimsSubmitted')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Submitted Volume</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('claimsApproved')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Approved Volume</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('claimValue')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Claim Value</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('auditRejections')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Audit Rejections</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('errorRate')}>
                  <div className="flex items-center space-x-1 justify-center">
                    <span>Error Rate</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('leakagePrevented')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Leakage Prevented</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {sortedDistricts.length > 0 ? (
                sortedDistricts.map((d) => {
                  let errorColorClass = 'text-emerald-400';
                  let errorBadge = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                  if (d.errorRate >= 9.0) {
                    errorColorClass = 'text-rose-400 font-extrabold';
                    errorBadge = 'bg-rose-500/10 border bg-rose-500/10 border-rose-500/20 text-rose-400';
                  } else if (d.errorRate >= 7.0) {
                    errorColorClass = 'text-orange-400 font-bold';
                    errorBadge = 'bg-orange-500/10 border-orange-500/20 text-orange-400';
                  }

                  return (
                    <tr key={d.id} className="hover:bg-slate-900/30 transition group">
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-400 group-hover:text-white transition">
                        {d.districtId}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">
                        {d.districtName}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        {d.claimsSubmitted.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        {d.claimsApproved.toLocaleString()}
                        <span className="text-[10px] text-slate-500 block">
                          ({((d.claimsApproved / d.claimsSubmitted) * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-bold text-white">
                        ${d.claimValue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-right text-rose-400 font-mono">
                        ${d.auditRejections.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${errorBadge}`}>
                          {d.errorRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-emerald-400 font-bold">
                        ${d.leakagePrevented.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setEditingDistrict(d)}
                          className="text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20 border border-transparent px-2 py-0.5 rounded transition"
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-sm">
                    No district summaries match the search query text criteria.
                  </td>
                </tr>
              )}

              {/* Total Aggregate Summary Row */}
              <tr className="bg-slate-950 font-bold text-white border-t border-slate-800">
                <td className="py-4 px-6" colSpan={2}>
                  Total Aggregations / Sums (Seeded)
                </td>
                <td className="py-4 px-6 text-right font-mono text-slate-300">
                  {totalSubmitted.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-right font-mono text-slate-300">
                  {totalApproved.toLocaleString()}
                  <span className="text-[10px] text-slate-500 block font-normal">
                    ({((totalApproved / totalSubmitted) * 100).toFixed(1)}% Avg)
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono text-emerald-400">
                  ${totalValue.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-right font-mono text-rose-400">
                  ${totalRejections.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center font-mono text-orange-400">
                  {averageErrorRate}% Avg
                </td>
                <td className="py-4 px-6 text-right font-mono text-emerald-400">
                  ${totalLeakagePrevented.toLocaleString()}
                </td>
                <td className="py-4 px-6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing District Dialog / Modal */}
      {editingDistrict && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-lg font-bold text-white mb-2">Simulate District Entry Row Correction</h4>
            <p className="text-slate-400 text-xs mb-4">
              Override submission parameters directly. Billing error percentage recalculates automatically.
            </p>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">District</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingDistrict.districtName} 
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-3 py-2 text-sm text-slate-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Claims Submitted</label>
                  <input 
                    type="number"
                    required
                    value={editingDistrict.claimsSubmitted} 
                    onChange={(e) => setEditingDistrict({ ...editingDistrict, claimsSubmitted: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Claims Approved</label>
                  <input 
                    type="number"
                    required
                    value={editingDistrict.claimsApproved} 
                    onChange={(e) => setEditingDistrict({ ...editingDistrict, claimsApproved: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Claim Value ($)</label>
                  <input 
                    type="number"
                    required
                    value={editingDistrict.claimValue} 
                    onChange={(e) => setEditingDistrict({ ...editingDistrict, claimValue: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Audit Rejections ($)</label>
                  <input 
                    type="number"
                    required
                    value={editingDistrict.auditRejections} 
                    onChange={(e) => setEditingDistrict({ ...editingDistrict, auditRejections: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono font-bold">Revenue Leakage Prevented ($)</label>
                <input 
                  type="number"
                  required
                  value={editingDistrict.leakagePrevented} 
                  onChange={(e) => setEditingDistrict({ ...editingDistrict, leakagePrevented: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded py-2 text-sm transition font-sans"
                >
                  Recalculate & Save Row
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDistrict(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded py-2 text-sm transition"
                >
                  Dismiss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
