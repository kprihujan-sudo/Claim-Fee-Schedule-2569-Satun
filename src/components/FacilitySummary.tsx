/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FacilitySummary as FacilityType } from '../types';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpDown, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Layers,
  Sparkles
} from 'lucide-react';

interface FacilitySummaryProps {
  facilities: FacilityType[];
  onUpdateFacility: (updated: FacilityType) => void;
}

export default function FacilitySummary({ facilities, onUpdateFacility }: FacilitySummaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof FacilityType>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityType | null>(null);

  // Filters
  const sortedFacilities = [...facilities]
    .filter(f => {
      const matchesSearch = f.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            f.districtName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            f.keyProcedureType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'All' || f.level === levelFilter;
      return matchesSearch && matchesLevel;
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

  const toggleSort = (field: keyof FacilityType) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Aggregations
  const totalVolume = facilities.reduce((sum, f) => sum + f.volume, 0);
  const averageRisk = parseFloat((facilities.reduce((sum, f) => sum + f.riskScore, 0) / facilities.length).toFixed(1));
  const averageCompliance = parseFloat((facilities.reduce((sum, f) => sum + f.complianceRate, 0) / facilities.length).toFixed(1));

  // Save edits of facility
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacility) {
      onUpdateFacility(editingFacility);
      setEditingFacility(null);
    }
  };

  const levels = ['All', 'Primary', 'Secondary', 'Tertiary'];

  return (
    <div className="space-y-6">
      {/* Page description */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Facility Summary Sheet (Sheet 3)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Detailed auditing profiles of individual health facilities. Use these indicators to pinpoint high-volume sites with declining compliance levels or elevated billing risk scores.
          </p>
        </div>
        <div className="flex gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg select-none">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 text-xs rounded-md transition font-medium ${
                levelFilter === lvl
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {lvl} Level
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Patient Volume Audited</span>
            <h4 className="text-xl font-bold text-teal-400 mt-1">{totalVolume.toLocaleString()} Claims</h4>
            <span className="text-[10px] text-slate-500 mt-0.5 inline-block">Reflecting all 12 facilities</span>
          </div>
          <Activity className="h-8 w-8 text-teal-500/20" />
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Average Compliance Rating</span>
            <h4 className="text-xl font-bold text-emerald-400 mt-1">{averageCompliance}%</h4>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded" style={{ width: `${averageCompliance}%` }} />
            </div>
          </div>
          <Sparkles className="h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Average Compliance Risk Index</span>
            <h4 className="text-xl font-bold text-orange-400 mt-1">{averageRisk} / 100</h4>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-orange-400 h-full rounded" style={{ width: `${averageRisk}%` }} />
            </div>
          </div>
          <ShieldAlert className="h-8 w-8 text-orange-500/20" />
        </div>
      </div>

      {/* Searching Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search facility, district, key procedure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Found {sortedFacilities.length} facilities matching criteria
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('facilityId')}>
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('facilityName')}>
                  <div className="flex items-center space-x-1">
                    <span>Facility Name</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6">District Name</th>
                <th className="py-4 px-6 text-center">Tier Level</th>
                <th className="py-4 px-6">Major CPT Focus</th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('baseFeeRate')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Base Fee</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('volume')}>
                  <div className="flex items-center space-x-1 justify-end">
                    <span>Volume</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('complianceRate')}>
                  <div className="flex items-center space-x-1 justify-center">
                    <span>Compliance</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center cursor-pointer hover:bg-slate-800/40 transition" onClick={() => toggleSort('riskScore')}>
                  <div className="flex items-center space-x-1 justify-center">
                    <span>Risk Index</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {sortedFacilities.length > 0 ? (
                sortedFacilities.map((f) => {
                  let levelBadge = '';
                  if (f.level === 'Tertiary') levelBadge = 'bg-rose-500/10 border-rose-500/20 text-rose-300 border';
                  else if (f.level === 'Secondary') levelBadge = 'bg-sky-500/10 border-sky-500/20 text-sky-300 border';
                  else levelBadge = 'bg-teal-500/10 border-teal-500/20 text-teal-300 border';

                  let riskColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  let riskLevelTxt = 'Low Risk';
                  if (f.riskScore >= 70) {
                    riskColor = 'text-rose-400 bg-rose-500/10 border border-rose-500/20 font-black animate-pulse';
                    riskLevelTxt = 'Critical';
                  } else if (f.riskScore >= 40) {
                    riskColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20 font-bold';
                    riskLevelTxt = 'Elevated';
                  }

                  return (
                    <tr key={f.id} className="hover:bg-slate-900/40 transition group">
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-400 group-hover:text-white">
                        {f.facilityId}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-white">
                        {f.facilityName}
                      </td>
                      <td className="py-3.5 px-6 text-slate-300 text-xs">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span>{f.districtName}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`px-2 py-0.5 text-[11px] rounded ${levelBadge}`}>
                          {f.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-400">
                        {f.keyProcedureType}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        ${f.baseFeeRate.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        {f.volume.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono">
                        <div className="inline-flex items-center space-x-1.5">
                          <span className={`${f.complianceRate < 85 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}`}>
                            {f.complianceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full ${riskColor}`}>
                          {f.riskScore} ({riskLevelTxt})
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setEditingFacility(f)}
                          className="text-xs text-emerald-400 hover:text-white bg-emerald-500/5 hover:bg-emerald-600/30 px-2 py-1 rounded transition border border-emerald-500/25"
                        >
                          Overrule
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-sm">
                    No facilities matched your active search or level criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overrule facility dialog */}
      {editingFacility && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-lg font-bold text-white mb-2">Configure Facility Parameter Matrix</h4>
            <p className="text-slate-400 text-xs mb-4">
              Directly override variables in the database for billing audit. 
            </p>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Facility Name</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingFacility.facilityName} 
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-3 py-2 text-sm text-slate-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Base Fee ($)</label>
                  <input 
                    type="number"
                    required
                    value={editingFacility.baseFeeRate} 
                    onChange={(e) => setEditingFacility({ ...editingFacility, baseFeeRate: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Claims Volume</label>
                  <input 
                    type="number"
                    required
                    value={editingFacility.volume} 
                    onChange={(e) => setEditingFacility({ ...editingFacility, volume: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Compliance Rate (%)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    value={editingFacility.complianceRate} 
                    onChange={(e) => setEditingFacility({ ...editingFacility, complianceRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Risk Index (0-100)</label>
                  <input 
                    type="number"
                    required
                    value={editingFacility.riskScore} 
                    onChange={(e) => setEditingFacility({ ...editingFacility, riskScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded py-2 text-sm transition"
                >
                  Apply Parameters
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
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
