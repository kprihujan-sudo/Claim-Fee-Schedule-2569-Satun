/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import DistrictSummary from './components/DistrictSummary';
import FacilitySummary from './components/FacilitySummary';
import FeeScheduleAnalysis from './components/FeeScheduleAnalysis';
import FacilityFeeMatrix from './components/FacilityFeeMatrix';
import AuditCheckView from './components/AuditCheckView';
import ComparativeChartsView from './components/ComparativeChartsView';

import { 
  getSavedDatabase, 
  saveDatabase, 
  resetDatabase,
  INITIAL_DATABASE
} from './data/claimsDatabase';
import { 
  DashboardDatabase, 
  ExecutiveKpi, 
  DistrictSummary as DistrictType, 
  FacilitySummary as FacilityType, 
  FeeSchedule, 
  FacilityFeeMatrix as MatrixType, 
  DiscrepancyDetail 
} from './types';

export default function App() {
  const [db, setDb] = useState<DashboardDatabase>(() => getSavedDatabase());
  const [currentTab, setCurrentTab] = useState<string>('executive');

  // Trigger auto-save whenever the in-memory state alters
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // Handle Restore Initial Seed
  const handleResetDatabase = () => {
    const confirmation = window.confirm(
      "Are you sure you want to restore the default dataset seeded from the factory claim spreadsheets?"
    );
    if (confirmation) {
      const freshDb = resetDatabase();
      setDb(freshDb);
    }
  };

  // Trigger slight randomized mutations to simulate live integrity audits & re-allocations
  const handleSimulatedReaudit = () => {
    setDb(prev => {
      // Tweak actual and targets a tiny bit for simulation
      const updatedKpis = prev.executiveKpis.map(k => {
        if (k.metricCode === 'REV_REC_01') {
          const mod = Math.floor((Math.random() - 0.5) * 150);
          const act = k.actual + mod;
          return {
            ...k,
            actual: act,
            achievePercent: parseFloat(((act / k.target) * 100).toFixed(1)),
            gap: act - k.target
          };
        }
        if (k.metricCode === 'REV_REC_02') {
          const modValue = Math.floor((Math.random() - 0.3) * 24000);
          const actValue = k.actual + modValue;
          return {
            ...k,
            actual: actValue,
            achievePercent: parseFloat(((actValue / k.target) * 100).toFixed(1)),
            gap: actValue - k.target
          };
        }
        return k;
      });

      const updatedChecks = prev.auditChecks.map(c => {
        // Resolve a couple of flags
        const resolved = Math.floor(Math.random() * 3);
        const flagged = Math.max(0, c.claimsFlagged - resolved);
        return {
          ...c,
          claimsFlagged: flagged,
          potentialSavings: Math.max(0, c.potentialSavings - (resolved * 320))
        };
      });

      return {
        ...prev,
        executiveKpis: updatedKpis,
        auditChecks: updatedChecks
      };
    });
  };

  // Handlers to update states reactively
  const handleUpdateKpi = (updatedKpi: ExecutiveKpi) => {
    setDb(prev => ({
      ...prev,
      executiveKpis: prev.executiveKpis.map(k => k.id === updatedKpi.id ? updatedKpi : k)
    }));
  };

  const handleUpdateDistrict = (updatedDistrict: DistrictType) => {
    setDb(prev => ({
      ...prev,
      districtSummaries: prev.districtSummaries.map(d => d.id === updatedDistrict.id ? updatedDistrict : d)
    }));
  };

  const handleUpdateFacility = (updatedFacility: FacilityType) => {
    setDb(prev => ({
      ...prev,
      facilitySummaries: prev.facilitySummaries.map(f => f.id === updatedFacility.id ? updatedFacility : f)
    }));
  };

  const handleUpdateSchedule = (updatedSchedule: FeeSchedule) => {
    setDb(prev => ({
      ...prev,
      feeSchedules: prev.feeSchedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s)
    }));
  };

  const handleUpdateMatrixRow = (updatedRow: MatrixType) => {
    setDb(prev => ({
      ...prev,
      facilityFeeMatrix: prev.facilityFeeMatrix.map(r => r.id === updatedRow.id ? updatedRow : r)
    }));
  };

  const handleUpdateDiscrepancy = (updatedDisc: DiscrepancyDetail) => {
    setDb(prev => {
      // Find old status
      const oldDisc = prev.discrepancies.find(d => d.id === updatedDisc.id);
      let updatedKpis = [...prev.executiveKpis];
      let updatedChecks = [...prev.auditChecks];

      // If status changes to 'Corrected', let's simulate the financial and compliance KPI updates!
      if (oldDisc && oldDisc.status !== 'Corrected' && updatedDisc.status === 'Corrected') {
        // Redo duplicate claim rate and prevented leakage
        updatedKpis = prev.executiveKpis.map(k => {
          if (k.metricCode === 'REV_REC_02') { // Leakage Saved
            const added = oldDisc.chargedAmount - oldDisc.allowedAmount;
            return {
              ...k,
              actual: k.actual + added,
              achievePercent: parseFloat((((k.actual + added) / k.target) * 100).toFixed(1)),
              gap: (k.actual + added) - k.target
            };
          }
          if (k.metricCode === 'REV_REC_04') { // Billing compliance score
            const upScore = Math.min(100, k.actual + 0.2);
            return {
              ...k,
              actual: parseFloat(upScore.toFixed(1)),
              achievePercent: parseFloat(((upScore / k.target) * 100).toFixed(1)),
              gap: parseFloat((upScore - k.target).toFixed(1))
            };
          }
          return k;
        });

        // Tweak active rule check flagged totals down
        updatedChecks = prev.auditChecks.map(c => {
          if (c.checkId === 'AC-DUP-01' || c.checkId === 'AC-UNB-02') {
            return {
              ...c,
              claimsFlagged: Math.max(0, c.claimsFlagged - 1),
              potentialSavings: Math.max(0, c.potentialSavings - (oldDisc.chargedAmount - oldDisc.allowedAmount))
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        discrepancies: prev.discrepancies.map(d => d.id === updatedDisc.id ? updatedDisc : d),
        executiveKpis: updatedKpis,
        auditChecks: updatedChecks
      };
    });
  };

  const renderActiveTabContent = () => {
    switch (currentTab) {
      case 'executive':
        return (
          <ExecutiveDashboard 
            kpis={db.executiveKpis} 
            onUpdateKpi={handleUpdateKpi} 
          />
        );
      case 'district':
        return (
          <DistrictSummary 
            districts={db.districtSummaries} 
            onUpdateDistrict={handleUpdateDistrict} 
          />
        );
      case 'facility':
        return (
          <FacilitySummary 
            facilities={db.facilitySummaries} 
            onUpdateFacility={handleUpdateFacility} 
          />
        );
      case 'fee_schedule':
        return (
          <FeeScheduleAnalysis 
            schedules={db.feeSchedules} 
            onUpdateSchedule={handleUpdateSchedule} 
          />
        );
      case 'matrix':
        return (
          <FacilityFeeMatrix 
            matrix={db.facilityFeeMatrix} 
            onUpdateMatrixRow={handleUpdateMatrixRow} 
          />
        );
      case 'audits':
        return (
          <AuditCheckView 
            checks={db.auditChecks} 
            discrepancies={db.discrepancies} 
            onUpdateDiscrepancy={handleUpdateDiscrepancy}
            onRefreshDatabase={handleSimulatedReaudit}
          />
        );
      case 'comparatives':
        return (
          <ComparativeChartsView 
            trends={db.monthlyTrends}
            breakdowns={db.procedureBreakdowns}
            rejections={db.rejectionCauses}
            payers={db.payerPerformances}
            leakages={db.revenueLeakages}
          />
        );
      default:
        return (
          <div className="py-20 text-center text-slate-500">
            Worksheet not found.
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab}
      onResetData={handleResetDatabase}
    >
      {renderActiveTabContent()}
    </DashboardLayout>
  );
}
