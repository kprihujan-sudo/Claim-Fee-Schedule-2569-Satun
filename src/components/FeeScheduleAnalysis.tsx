/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FeeSchedule } from '../types';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUpDown, 
  DollarSign, 
  Percent, 
  Activity, 
  ShieldAlert, 
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface FeeScheduleAnalysisProps {
  schedules: FeeSchedule[];
  onUpdateSchedule: (updated: FeeSchedule) => void;
}

export default function FeeScheduleAnalysis({ schedules, onUpdateSchedule }: FeeScheduleAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof FeeSchedule>('deviationPercent');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<FeeSchedule | null>(null);

  // Filter schedules
  const categories = ['All', 'Consultation', 'Imaging', 'Laboratory', 'Surgery', 'Pharmacy'];

  const filteredSchedules = schedules
    .filter(s => {
      const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
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

  const toggleSort = (field: keyof FeeSchedule) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Chart data
  const chartData = filteredSchedules.map(s => ({
    name: s.code,
    description: s.description,
    'Standard Allowed': s.standardAllowed,
    'Actual Charged': s.actualCharged,
    'Deviation %': s.deviationPercent
  }));

  // Average Calculations
  const avgDeviation = parseFloat(
    (filteredSchedules.reduce((sum, s) => sum + s.deviationPercent, 0) / (filteredSchedules.length || 1)).toFixed(1)
  );

  const highestDeviation = filteredSchedules.reduce((max, s) => s.deviationPercent > max ? s.deviationPercent : max, 0);

  // Edit action
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      const allowed = editingSchedule.standardAllowed;
      const charged = editingSchedule.actualCharged;
      const dev = allowed > 0 ? parseFloat((((charged - allowed) / allowed) * 100).toFixed(1)) : 0;
      
      let risk: 'Low' | 'Medium' | 'High' = 'Low';
      if (dev >= 30) risk = 'High';
      else if (dev >= 10) risk = 'Medium';

      onUpdateSchedule({
        ...editingSchedule,
        deviationPercent: dev,
        riskLevel: risk
      });
      setEditingSchedule(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Contract Fee Schedule Analysis (Sheet 4)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Validating actual billed amounts against established contract fee schedule ceilings. Focus heavily on procedures with high positive percentage deviations.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg select-none overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-md transition font-medium shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Average Price Leakage Deviation</span>
            <h4 className="text-xl font-bold text-orange-400 mt-1">{avgDeviation}%</h4>
            <span className="text-[10px] text-slate-500 mt-0.5 inline-block">Markup above baseline contracts</span>
          </div>
          <TrendingUp className="h-8 w-8 text-orange-400/20" />
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Highest Procedural Price Deviation</span>
            <h4 className="text-xl font-bold text-rose-400 mt-1">+{highestDeviation}%</h4>
            <span className="text-[10px] text-rose-400 mt-0.5 inline-block font-mono">Requires corrective policy rule</span>
          </div>
          <ShieldAlert className="h-8 w-8 text-rose-500/20" />
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Standard CPT Codes Benchmarked</span>
            <h4 className="text-xl font-bold text-teal-400 mt-1">{filteredSchedules.length} Items</h4>
            <span className="text-[10px] text-slate-500 mt-0.5 inline-block">Active contracts in spreadsheet</span>
          </div>
          <Activity className="h-8 w-8 text-teal-500/20" />
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            <span>Contract Allowed vs. Actual Billed rates ($)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">By CPT Procedure Code</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                labelStyle={{ color: '#white', fontWeight: 'bold' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="Standard Allowed" fill="#475569" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="Actual Charged" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search filtration bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Schedules list table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-800/40" onClick={() => toggleSort('code')}>
                  <div className="flex items-center space-x-1">
                    <span>CPT Code</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40" onClick={() => toggleSort('standardAllowed')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Standard Allowed ($)</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40" onClick={() => toggleSort('actualCharged')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Actual Charged ($)</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40" onClick={() => toggleSort('deviationPercent')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Deviation (%)</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Risk Level</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((s) => {
                  let riskBadge = '';
                  if (s.riskLevel === 'High') {
                    riskBadge = 'bg-rose-500/10 border-rose-500/20 text-rose-400 border font-extrabold';
                  } else if (s.riskLevel === 'Medium') {
                    riskBadge = 'bg-orange-500/10 border-orange-500/20 text-orange-400 border font-bold';
                  } else {
                    riskBadge = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 border';
                  }

                  return (
                    <tr key={s.id} className="hover:bg-slate-900/40 transition group">
                      <td className="py-3.5 px-6 font-mono text-xs text-emerald-400 font-bold">
                        {s.code}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">
                        {s.description}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-400">
                        <span className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-slate-400">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        ${s.standardAllowed.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-white">
                        ${s.actualCharged.toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-6 text-right font-mono font-bold ${s.deviationPercent > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        +{s.deviationPercent}%
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-xs rounded-full ${riskBadge}`}>
                          {s.riskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setEditingSchedule(s)}
                          className="text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded transition border border-slate-800 hover:border-slate-700"
                        >
                          Revise Rate
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-sm">
                    No active contract codes correspond to search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing schedule editor modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-lg font-bold text-white mb-2">Simulate Contract Rate Revise</h4>
            <p className="text-slate-400 text-xs mb-4">
              Edit the baseline contract allowed and observed charging ceilings. Deviation recalculates reactively.
            </p>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">CPT Procedure</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${editingSchedule.code} - ${editingSchedule.description}`} 
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-3 py-2 text-xs text-slate-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Standard Contract Allowed ($)</label>
                  <input 
                    type="number"
                    required
                    value={editingSchedule.standardAllowed} 
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, standardAllowed: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Actual Provider Billed ($)</label>
                  <input 
                    type="number"
                    required
                    value={editingSchedule.actualCharged} 
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, actualCharged: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded py-2 text-sm transition"
                >
                  Recalculate Bounds
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded py-2 text-sm transition"
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
