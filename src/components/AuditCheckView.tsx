/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditCheck, DiscrepancyDetail } from '../types';
import { 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  DollarSign,
  Briefcase,
  Play
} from 'lucide-react';

interface AuditCheckViewProps {
  checks: AuditCheck[];
  discrepancies: DiscrepancyDetail[];
  onUpdateDiscrepancy: (updated: DiscrepancyDetail) => void;
  onRefreshDatabase: () => void;
}

export default function AuditCheckView({ 
  checks, 
  discrepancies, 
  onUpdateDiscrepancy,
  onRefreshDatabase 
}: AuditCheckViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  // Filter Discrepancies
  const filteredDiscrepancies = discrepancies.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.claimId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.conflictReason.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple grouping
    const matchesStatus = selectedCategory === 'All' || item.status === selectedCategory;
    return matchesSearch && matchesStatus;
  });

  // Calculate audit statistics
  const totalFlagged = checks.reduce((sum, current) => sum + current.claimsFlagged, 0);
  const totalPotentialSavings = checks.reduce((sum, current) => sum + current.potentialSavings, 0);

  const pendingCount = discrepancies.filter(d => d.status === 'Pending Review').length;
  const correctedCount = discrepancies.filter(d => d.status === 'Corrected').length;

  // Run integrity audit rule check
  const handleTriggerReaudit = () => {
    setIsAuditing(true);
    setAuditProgress(10);
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAuditing(false);
            onRefreshDatabase(); // Slightly shift numbers mock style to show recalculations
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleResolveStatus = (item: DiscrepancyDetail, newStatus: DiscrepancyDetail['status']) => {
    onUpdateDiscrepancy({
      ...item,
      status: newStatus
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro and Action */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Audit Checks & Discrepancies (Sheets 6 & 7)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Running computerized policy and integrity rules matching duplicate encounters, CPT unbundling, patient age conflicts, and upcoded consultations.
          </p>
        </div>
        <button
          onClick={handleTriggerReaudit}
          disabled={isAuditing}
          className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 ${
            isAuditing ? 'animate-pulse' : ''
          }`}
        >
          <Play className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? `Re-scanning (${auditProgress}%)` : 'Run Integrity Re-Audit'}</span>
        </button>
      </div>

      {/* Grid summarizing Active Rules Match */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center space-x-3.5">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Total Claims Flagged</p>
            <h5 className="text-lg font-bold text-slate-200">{totalFlagged.toLocaleString()} rows</h5>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center space-x-3.5">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Flagged Potential Recovery</p>
            <h5 className="text-lg font-bold text-emerald-400">${totalPotentialSavings.toLocaleString()}</h5>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Pending Audited Reviews</p>
            <h5 className="text-lg font-bold text-amber-400">{pendingCount} row files</h5>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Corrected / Slipped Back</p>
            <h5 className="text-lg font-bold text-emerald-400">{correctedCount} rows cleared</h5>
          </div>
        </div>
      </div>

      {/* Progress feedback bar */}
      {isAuditing && (
        <div className="w-full bg-slate-950 p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-300 font-mono">
            <span>Querying 527,412 database transaction sets via system audit rules...</span>
            <span>{auditProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${auditProgress}%` }} />
          </div>
        </div>
      )}

      {/* Section 1: Active Audit Check Rule Suites */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sheet 6: Audit Integrity Rules Match</h3>
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Rule Code</th>
                  <th className="py-3 px-6">Checks Rule Description</th>
                  <th className="py-3 px-6">Integrity Category</th>
                  <th className="py-3 px-6 text-right">Rules Tested</th>
                  <th className="py-3 px-6 text-right">Identified Flags</th>
                  <th className="py-3 px-6 text-right">Potential Recovery</th>
                  <th className="py-3 px-6 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {checks.map((chk) => {
                  let alertBadge = 'bg-slate-900 text-slate-400';
                  if (chk.priority === 'Critical') alertBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black animate-pulse';
                  else if (chk.priority === 'High') alertBadge = 'bg-orange-500/10 text-orange-450 border border-orange-550/20 font-bold';
                  else if (chk.priority === 'Medium') alertBadge = 'bg-amber-500/10 text-amber-400';

                  return (
                    <tr key={chk.id} className="hover:bg-slate-900/30 transition text-slate-300">
                      <td className="py-3 px-6 font-mono text-xs font-bold text-emerald-400">
                        {chk.checkId}
                      </td>
                      <td className="py-3 px-6 font-medium text-slate-200">
                        {chk.checkName}
                      </td>
                      <td className="py-3 px-6 text-xs font-mono text-slate-400">
                        {chk.category}
                      </td>
                      <td className="py-3 px-6 text-right font-mono text-xs">
                        {chk.rulesRun.toLocaleString()} runs
                      </td>
                      <td className="py-3 px-6 text-right text-rose-400 font-bold font-mono">
                        {chk.claimsFlagged.toLocaleString()} rows
                      </td>
                      <td className="py-3 px-6 text-right text-emerald-400 font-black font-mono">
                        ${chk.potentialSavings.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-[10.5px] rounded-full ${alertBadge}`}>
                          {chk.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Discrepancy Detail - Live review */}
      <div className="space-y-3 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sheet 7: Flagged Discrepancy Detail Rows</h3>
            <p className="text-[11px] text-slate-500">Live clinical claim files identified by active audit filters. Resolve or clear them to update global KPIs.</p>
          </div>

          {/* Tab filter status */}
          <div className="flex bg-slate-950 border border-slate-800 p-1.5 rounded-lg text-xs leading-none">
            {['All', 'Pending Review', 'Approved', 'Corrected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedCategory(status)}
                className={`px-2.5 py-1.5 rounded transition ${
                  selectedCategory === status
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Search for individual claims */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Patient, ID, Provider or Conflict..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-755 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Discrepancy Detail Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiscrepancies.length > 0 ? (
            filteredDiscrepancies.map((item) => {
              let statusBadge = '';
              if (item.status === 'Pending Review') statusBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
              else if (item.status === 'Approved') statusBadge = 'bg-blue-500/10 text-blue-300 border border-blue-500/20';
              else if (item.status === 'Corrected') statusBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold';
              else statusBadge = 'bg-rose-500/10 text-rose-450 border border-rose-500/20';

              return (
                <div key={item.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">{item.claimId}</span>
                      <span className={`text-[10.5px] px-2 py-0.5 rounded ${statusBadge}`}>{item.status}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                      <div>
                        <p className="text-slate-400">Patient File</p>
                        <p className="font-bold text-slate-100 mt-0.5">{item.patientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400">Provider Health site</p>
                        <p className="font-bold text-slate-100 mt-0.5">{item.provider}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs py-1">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-mono">Billed</span>
                        <span className="font-extrabold text-rose-400">${item.chargedAmount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-mono">Allowed Limit</span>
                        <span className="font-extrabold text-slate-300">${item.allowedAmount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-mono">Procedure code</span>
                        <span className="font-bold text-slate-300 underline font-mono">{item.procedureCode}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900 border border-slate-850 rounded text-xs leading-relaxed text-slate-400">
                      <span className="text-rose-400 font-bold mr-1">Alert:</span> {item.conflictReason}
                    </div>
                  </div>

                  {/* Actions to resolve Row */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-end space-x-2">
                    <span className="text-[10.5px] text-slate-550 mr-auto font-mono">{item.date}</span>
                    {item.status === 'Pending Review' && (
                      <>
                        <button
                          onClick={() => handleResolveStatus(item, 'Corrected')}
                          className="px-2.5 py-1 text-xs font-bold leading-none bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-md transition"
                        >
                          Resolve & Correct
                        </button>
                        <button
                          onClick={() => handleResolveStatus(item, 'Rejected')}
                          className="px-2.5 py-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-md transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {item.status !== 'Pending Review' && (
                      <button
                        onClick={() => handleResolveStatus(item, 'Pending Review')}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 rounded transition"
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500 text-sm">
              No flagged discrepancies matched your filter or search criteria terms. Clear constraints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
