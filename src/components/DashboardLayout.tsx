/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckSquare, 
  Activity, 
  BarChart3, 
  Table2, 
  TrendingUp, 
  ShieldAlert, 
  Database,
  RefreshCw,
  FolderOpen,
  Layers,
  HeartPulse,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onResetData: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ 
  currentTab, 
  setCurrentTab, 
  onResetData, 
  children 
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'executive', name: 'Executive Dashboard KPIs', icon: Activity, description: 'High-level executive metrics' },
    { id: 'district', name: 'District Summary', icon: MapPin, description: 'Regional performance report' },
    { id: 'facility', name: 'Facility Summary', icon: Building2, description: 'Hospital & clinic level insights' },
    { id: 'fee_schedule', name: 'Fee Schedule Analysis', icon: TrendingUp, description: 'Price standard deviation audit' },
    { id: 'matrix', name: 'Facility Fee Matrix', icon: Table2, description: 'Comparison grid across clinics' },
    { id: 'audits', name: 'Audit Integrity Checks', icon: ShieldAlert, description: 'Real-time billing rules checks' },
    { id: 'comparatives', name: 'Comparative Charts & Trends', icon: BarChart3, description: 'Comprehensive metric forecasting' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden relative">
      {/* Ambient glass background glow filters */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px]"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 z-10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <HeartPulse className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
                Claim PRO<span className="text-blue-400 font-black ml-1">5</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Medical Audit Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Worksheets & Sheets (12 total)
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group border ${
                  isActive 
                    ? 'bg-white/10 border-white/10 text-white font-medium' 
                    : 'text-slate-450 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <div className="truncate">
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 truncate group-hover:text-slate-350">{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Database Quick Tools Footer */}
        <div className="p-4 border-t border-white/10 bg-white/2 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center space-x-1">
              <Database className="h-3.5 w-3.5 text-slate-405" />
              <span>Offline Database</span>
            </span>
            <span className="bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded text-[10.5px]">Seeded</span>
          </div>
          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-350" />
            <span>Restore Factory Excel Seed</span>
          </button>
          <div className="text-[10px] text-center text-slate-450">
            Audit Engine v5.12.0 • Real clinical reference
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle & sheet overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2 flex items-center justify-center font-bold text-white shadow-lg">
              <HeartPulse className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Claim PRO5</h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Medical Audit Suite</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-450 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left border transition-all ${
                  isActive 
                    ? 'bg-white/10 border-white/10 text-white font-medium' 
                    : 'text-slate-450 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="text-[10px] text-slate-450 mt-1">{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-white/2 backdrop-blur-md space-y-3">
          <button
            onClick={() => {
              onResetData();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/5 text-slate-300 rounded-xl border border-white/10 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Database Seed</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        {/* Mobile Header Banner */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white/2 backdrop-blur-md border-b border-white/10 h-16 shrink-0">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-5 w-5 text-blue-400 animate-pulse" />
              <span className="font-bold text-white text-md">Claim PRO5</span>
            </div>
          </div>
          <div className="text-xs bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-slate-300 font-mono">
            {menuItems.find(m => m.id === currentTab)?.name.split(' ')[0]} Worklist
          </div>
        </header>

        {/* Global Stats Overlay/Action Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/2 backdrop-blur-md border-b border-white/10 shrink-0 h-16">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-medium text-slate-300">
              Active Excel Sheet View: <span className="text-blue-400 font-semibold">{menuItems.find(i => i.id === currentTab)?.name}</span>
            </h2>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium text-slate-300">Auditor Session: </span>
              <span className="font-mono text-emerald-400">Claims Live Audit Active</span>
            </span>
            <span className="border-l border-white/10 h-4" />
            <span className="font-mono text-slate-400">Claims Tracker</span>
          </div>
        </header>

        {/* Scrollable View Containment */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
