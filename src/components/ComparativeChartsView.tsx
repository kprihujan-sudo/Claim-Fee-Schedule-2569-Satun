/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MonthlyTrend, 
  ProcedureBreakdown, 
  RejectionCause, 
  PayerPerformance, 
  RevenueLeakage 
} from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Percent, 
  ArrowRightCircle,
  HelpCircle,
  HeartPulse
} from 'lucide-react';

interface ComparativeChartsViewProps {
  trends: MonthlyTrend[];
  breakdowns: ProcedureBreakdown[];
  rejections: RejectionCause[];
  payers: PayerPerformance[];
  leakages: RevenueLeakage[];
}

export default function ComparativeChartsView({ 
  trends, 
  breakdowns, 
  rejections, 
  payers, 
  leakages 
}: ComparativeChartsViewProps) {

  // Colors for charts
  const COLOR_PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6'];

  // Total sums for leakage recovery
  const totalBaseline = leakages.reduce((sum, l) => sum + l.baselineLoss, 0);
  const totalRecovered = leakages.reduce((sum, l) => sum + l.recovered, 0);
  const totalRemainingLoss = totalBaseline - totalRecovered;
  const overallYieldRate = parseFloat(((totalRecovered / totalBaseline) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Comparative Charts & Trends (Sheets 8 - 12)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Analyzing multi-dimensional metrics across monthly timelines, procedure categories, health insurers, and transactional root-cause factors.
          </p>
        </div>
      </div>

      {/* Grid: 2 columns for major visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sheet 8 - Monthly Volume & Claim value trends */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Sheet 8: Inpatient vs Outpatient Claim Values</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Historical rolling 12-month claim valuations ($)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="inpatientClaimValue" name="Inpatient Value ($)" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="outpatientClaimValue" name="Outpatient Value ($)" stroke="#3b82f6" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sheet 9 - Procedure Category Leakage */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Sheet 9: Claim value vs Prevention Leakage</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Procedural categories with leakages prevented</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdowns} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="procedureCategory" stroke="#64748b" fontSize={9.5} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="totalValue" name="Total Claim value ($)" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leakageAmount" name="Prevented Leakage ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sheet 10 & 12 row breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section: Sheet 10 - Claim Rejection Root Causes */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Sheet 10: Billing Audit Rejection Root Causes</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Distribution and corrective systems for claim errors</p>
          </div>

          <div className="space-y-4">
            {rejections.map((rej, idx) => (
              <div key={rej.id} className="space-y-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-850">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{rej.rootCauseReason}</span>
                  <span className="font-mono text-emerald-400 font-extrabold">{rej.percentage}% ({rej.count} claims)</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${rej.percentage}%`, backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>System fixes: <span className="text-slate-400 font-sans italic">{rej.systemRemediation}</span></span>
                  <span className="font-mono text-rose-300 font-bold">${rej.dollarImpact.toLocaleString()} impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Sheet 12 - Revenue Leakage & Gap Analysis */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Sheet 12: Leakage Recovery Gap Analysis</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Benchmarking baseline fraud / leakage losses against actual volume recovered</p>
            </div>

            {/* Overall summary stats */}
            <div className="grid grid-cols-3 gap-2.5 bg-slate-900 p-3.5 rounded-lg text-center border border-slate-850">
              <div>
                <span className="text-[9.5px] uppercase font-semibold text-slate-500 block">Baseline Leakage Loss</span>
                <span className="text-md font-extrabold text-slate-300 block mt-1">${totalBaseline.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9.5px] uppercase font-semibold text-slate-500 block">Audited Recovered</span>
                <span className="text-md font-extrabold text-emerald-450 block mt-1">${totalRecovered.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9.5px] uppercase font-semibold text-slate-500 block">Overall Yield Recovery</span>
                <span className="text-lg font-black text-emerald-400 block mt-0.5">{overallYieldRate}%</span>
              </div>
            </div>

            {/* Recovery bar breakdown */}
            <div className="space-y-3 pt-2">
              {leakages.map((leak) => (
                <div key={leak.id} className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-medium">{leak.category}</span>
                    <span className="text-slate-400 font-mono text-[10.5px]">
                      Recovered <span className="text-emerald-400 font-bold">${leak.recovered.toLocaleString()}</span> of ${leak.baselineLoss.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-800 h-1.5 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: `${leak.progressPercent}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">{leak.progressPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Section: Sheet 11 - Payer Performance Benchmark Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sheet 11: Commercial Payer / Insurer Performance Matrix</h3>
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Insurer Name</th>
                  <th className="py-3.5 px-6 text-right">Total Paid Claims Volume</th>
                  <th className="py-3.5 px-6 text-center">Insurers Deviation Rate (%)</th>
                  <th className="py-3.5 px-6 text-center">Avg Processing Days to Pay</th>
                  <th className="py-3.5 px-6 text-center">Audit Overpayments (%)</th>
                  <th className="py-3.5 px-6 text-center">Audit Underpayments (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {payers.map((pay) => {
                  let alertDays = 'text-slate-350';
                  if (pay.avgDaysToPay >= 30) alertDays = 'text-rose-400 font-extrabold';

                  return (
                    <tr key={pay.id} className="hover:bg-slate-900/30 transition text-slate-300">
                      <td className="py-3.5 px-6 font-bold text-slate-100">
                        {pay.payerName}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        {pay.totalPaidClaims.toLocaleString()} claims
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono">
                        <span className={`inline-block px-2.5 py-0.5 rounded font-bold ${
                          pay.denialRate >= 10 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          {pay.denialRate}%
                        </span>
                      </td>
                      <td className={`py-3.5 px-6 text-center font-mono ${alertDays}`}>
                        {pay.avgDaysToPay} Days
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-rose-400">
                        {pay.overpaymentRate}% Overpaid
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-teal-400">
                        {pay.underpaymentRate}% Underpaid
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
