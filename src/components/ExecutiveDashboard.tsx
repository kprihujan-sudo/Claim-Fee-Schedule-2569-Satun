/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExecutiveKpi } from '../types';
import { 
  Activity, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Search, 
  Filter, 
  TrendingDown, 
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';

interface ExecutiveDashboardProps {
  kpis: ExecutiveKpi[];
  onUpdateKpi: (updated: ExecutiveKpi) => void;
}

export default function ExecutiveDashboard({ kpis, onUpdateKpi }: ExecutiveDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingKpi, setEditingKpi] = useState<ExecutiveKpi | null>(null);

  // Categories
  const categories = ['All', 'Revenue', 'Compliance', 'Quality', 'Volume'];

  // Filtered KPIs
  const filteredKpis = kpis.filter(kpi => {
    const matchesSearch = kpi.metricName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kpi.metricCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || kpi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const averageAchievePercent = parseFloat(
    (kpis.reduce((acc, curr) => acc + curr.achievePercent, 0) / kpis.length).toFixed(1)
  );

  const atRiskKpis = kpis.filter(kpi => kpi.status === 'Underperforming' || kpi.status === 'Critical' || kpi.status === 'At Risk');
  const onTrackKpis = kpis.filter(kpi => kpi.status === 'On Track');

  // Revenue specific summary
  const revenuePreventedKpi = kpis.find(k => k.metricCode === 'REV_REC_02');
  const revenuePreventedVal = revenuePreventedKpi ? revenuePreventedKpi.actual : 1240500;

  // Chart Data format
  const chartData = filteredKpis.map(k => ({
    name: k.metricCode,
    fullName: k.metricName,
    Target: k.target,
    Actual: k.actual,
    Achieve: k.achievePercent,
    status: k.status
  }));

  // Handle Edit Save
  const handleSaveKpiEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKpi) {
      const target = editingKpi.target;
      const actual = editingKpi.actual;
      // Recalculate achieve % and gap
      let achieve = 100;
      let gap = 0;
      if (target > 0) {
        // For average audit turnaround or overpayments, lower is actually better, standard ratio:
        const lowerIsBetter = editingKpi.metricCode === 'REV_REC_03' || editingKpi.metricCode === 'REV_REC_06';
        if (lowerIsBetter) {
          achieve = parseFloat(((target / actual) * 100).toFixed(1));
          gap = parseFloat((actual - target).toFixed(1));
        } else {
          achieve = parseFloat(((actual / target) * 100).toFixed(1));
          gap = parseFloat((actual - target).toFixed(1));
        }
      }
      
      let status: 'On Track' | 'At Risk' | 'Underperforming' | 'Critical' = 'On Track';
      if (achieve >= 90) status = 'On Track';
      else if (achieve >= 80) status = 'At Risk';
      else if (achieve >= 60) status = 'Underperforming';
      else status = 'Critical';

      onUpdateKpi({
        ...editingKpi,
        achievePercent: achieve,
        gap,
        status
      });
      setEditingKpi(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro and Overview card */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Dashboard KPIs (Sheet 1)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Core performance indicators measuring audit yield, financial governance, code upcoding alerts, compliance score ratings, and systemic accuracy.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded font-medium flex items-center space-x-1">
            <FileCheck className="h-3.5 w-3.5" />
            <span>Fully Compliant Seeding</span>
          </span>
        </div>
      </div>

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="kpi-card-leakage" className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Leakage Revenue Saved</p>
            <h3 className="text-2xl font-bold text-white mt-1">${revenuePreventedVal.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>82.7% of annual target reached</span>
            </p>
          </div>
        </div>

        <div id="kpi-card-achieve" className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Average KPI Achievement</p>
            <h3 className="text-2xl font-bold text-white mt-1">{averageAchievePercent}%</h3>
            <p className="text-[10px] text-slate-400 flex items-center mt-1">
              <span>Balanced general audit performance</span>
            </p>
          </div>
        </div>

        <div id="kpi-card-ontrack" className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Metrics On Track</p>
            <h3 className="text-2xl font-bold text-white mt-1">{onTrackKpis.length} / {kpis.length}</h3>
            <p className="text-[10px] text-teal-400 flex items-center mt-1">
              <span>Stable compliance parameters</span>
            </p>
          </div>
        </div>

        <div id="kpi-card-atrisk" className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Metrics At Risk / Critical</p>
            <h3 className="text-2xl font-bold text-white mt-1">{atRiskKpis.length} Metrics</h3>
            <p className="text-[10px] text-rose-400 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>Requires provider adjustments</span>
            </p>
          </div>
        </div>
      </div>

      {/* Target vs Actual Bar Chart Visualization */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>KPI Target vs. Actual Comparison (Current Filtered Dataset)</span>
          <span className="text-[10px] font-mono text-slate-500 font-normal">X-Axis Labels: Metric Code</span>
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                itemStyle={{ color: '#cbd5e1' }}
                formatter={(value: any, name: string, props: any) => {
                  const unit = props.payload.fullName.includes('%') ? '%' : props.payload.fullName.includes('$') ? '$' : '';
                  if (unit === '$') return [`$${value.toLocaleString()}`, name];
                  if (unit === '%') return [`${value}%`, name];
                  return [value.toLocaleString(), name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconSize={12} iconType="circle" />
              <Bar dataKey="Target" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-target-${index}`} fill="#334155" />
                ))}
              </Bar>
              <Bar dataKey="Actual" radius={[4, 4, 0, 0]} barSize={20}>
                {chartData.map((entry, index) => {
                  let barColor = '#10b981'; // Green (On Track)
                  if (entry.status === 'Critical') barColor = '#f43f5e'; // Red
                  else if (entry.status === 'Underperforming') barColor = '#f59e0b'; // Amber
                  else if (entry.status === 'At Risk') barColor = '#fb923c'; // Orange
                  return <Cell key={`cell-actual-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search metric name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto select-none py-1">
          <Filter className="h-3.5 w-3.5 text-slate-500 hidden sm:block shrink-0" />
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg shrink-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-md transition font-medium ${
                  selectedCategory === category
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs Grid and List */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Code</th>
                <th className="py-4 px-6">Metric Name</th>
                <th className="py-4 px-6 text-right">Target</th>
                <th className="py-4 px-6 text-right">Actual</th>
                <th className="py-4 px-6 text-center">Achieve %</th>
                <th className="py-4 px-6 text-right">Gap</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredKpis.length > 0 ? (
                filteredKpis.map((kpi) => {
                  let statusBadge = '';
                  let statusTxtClass = '';
                  if (kpi.status === 'On Track') {
                    statusBadge = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                    statusTxtClass = 'text-emerald-400';
                  } else if (kpi.status === 'At Risk') {
                    statusBadge = 'bg-orange-500/10 border-orange-500/20 text-orange-400';
                    statusTxtClass = 'text-orange-400';
                  } else if (kpi.status === 'Underperforming') {
                    statusBadge = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                    statusTxtClass = 'text-amber-400';
                  } else {
                    statusBadge = 'bg-rose-500/10 border-rose-500/20 text-rose-400 border';
                    statusTxtClass = 'text-rose-400';
                  }

                  const isPercent = kpi.metricName.includes('%') || kpi.metricName.includes('Score');
                  const isCurrency = kpi.metricName.includes('$');

                  const formatVal = (val: number) => {
                    if (isCurrency) return `$${val.toLocaleString()}`;
                    if (isPercent) return `${val}%`;
                    return val.toLocaleString();
                  };

                  return (
                    <tr key={kpi.id} className="hover:bg-slate-900/40 transition group">
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-400 group-hover:text-white transition">
                        {kpi.metricCode}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">
                        <div>
                          <span>{kpi.metricName}</span>
                          <span className="inline-block ml-2 text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500">
                            {kpi.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-right font-semibold text-slate-300">
                        {formatVal(kpi.target)}
                      </td>
                      <td className="py-3.5 px-6 text-right font-black text-white">
                        {formatVal(kpi.actual)}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                kpi.status === 'On Track' ? 'bg-emerald-500' :
                                kpi.status === 'At Risk' ? 'bg-orange-500' :
                                kpi.status === 'Underperforming' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(kpi.achievePercent, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono font-bold ${statusTxtClass}`}>{kpi.achievePercent}%</span>
                        </div>
                      </td>
                      <td className={`py-3.5 px-6 text-right font-mono text-xs ${kpi.gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {kpi.gap > 0 ? '+' : ''}{formatVal(kpi.gap)}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-block px-2 py-0.5 border text-[11px] font-medium rounded-full ${statusBadge}`}>
                          {kpi.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setEditingKpi(kpi)}
                          className="text-xs text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/30 px-2 py-1 rounded transition"
                        >
                          Tweak
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-slate-500 text-sm">
                    No Executive KPIs matched your active filter rules. Change criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing KPI Modal / Segment */}
      {editingKpi && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-lg font-bold text-white mb-2">Simulate Custom Excel Upload / Correction</h4>
            <p className="text-slate-400 text-xs mb-4">
              Directly override columns for <span className="text-emerald-400 font-mono">{editingKpi.metricCode}</span> of the claims data system.
            </p>
            <form onSubmit={handleSaveKpiEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Metric Identifier & Name</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingKpi.metricName} 
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-3 py-2 text-sm text-slate-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Value</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    value={editingKpi.target} 
                    onChange={(e) => setEditingKpi({ ...editingKpi, target: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Actual Value</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    value={editingKpi.actual} 
                    onChange={(e) => setEditingKpi({ ...editingKpi, actual: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded py-2 text-sm transition"
                >
                  Recalculate & Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKpi(null)}
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
