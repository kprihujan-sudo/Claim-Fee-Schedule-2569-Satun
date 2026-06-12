/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExecutiveKpi {
  id: string;
  metricCode: string;
  metricName: string;
  category: 'Revenue' | 'Quality' | 'Volume' | 'Compliance';
  target: number;
  actual: number;
  achievePercent: number;
  gap: number;
  status: 'On Track' | 'At Risk' | 'Underperforming' | 'Critical';
}

export interface DistrictSummary {
  id: string;
  districtId: string;
  districtName: string;
  claimsSubmitted: number;
  claimsApproved: number;
  claimValue: number;
  auditRejections: number;
  errorRate: number; // as percentage, e.g. 8.4
  leakagePrevented: number;
}

export interface FacilitySummary {
  id: string;
  facilityId: string;
  facilityName: string;
  districtName: string;
  level: 'Primary' | 'Secondary' | 'Tertiary';
  keyProcedureType: string;
  baseFeeRate: number;
  volume: number;
  complianceRate: number; // percentage
  riskScore: number; // 0-100
}

export interface FeeSchedule {
  id: string;
  code: string;
  description: string;
  category: 'Consultation' | 'Imaging' | 'Laboratory' | 'Surgery' | 'Pharmacy';
  standardAllowed: number;
  actualCharged: number;
  deviationPercent: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface FacilityFeeMatrix {
  id: string;
  code: string;
  description: string;
  generalHospital: number;
  districtClinic: number;
  mercyMedical: number;
  hopeHealthCenter: number;
  nationalClinic: number;
}

export interface AuditCheck {
  id: string;
  checkId: string;
  checkName: string;
  category: 'Duplicate' | 'Unbundling' | 'Upcoding' | 'Age Conflict' | 'Policy Limit';
  rulesRun: number;
  claimsFlagged: number;
  potentialSavings: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface DiscrepancyDetail {
  id: string;
  claimId: string;
  patientName: string;
  provider: string;
  date: string;
  procedureCode: string;
  chargedAmount: number;
  allowedAmount: number;
  conflictReason: string;
  status: 'Pending Review' | 'Approved' | 'Corrected' | 'Rejected';
}

export interface MonthlyTrend {
  id: string;
  month: string;
  year: number;
  inpatientVolume: number;
  outpatientVolume: number;
  inpatientClaimValue: number;
  outpatientClaimValue: number;
}

export interface ProcedureBreakdown {
  id: string;
  procedureCategory: string;
  claimCount: number;
  totalValue: number;
  leakageAmount: number;
  auditedCodeCount: number;
}

export interface RejectionCause {
  id: string;
  rootCauseReason: string;
  percentage: number;
  count: number;
  dollarImpact: number;
  systemRemediation: string;
}

export interface PayerPerformance {
  id: string;
  payerName: string;
  totalPaidClaims: number;
  denialRate: number;
  avgDaysToPay: number;
  overpaymentRate: number;
  underpaymentRate: number;
}

export interface RevenueLeakage {
  id: string;
  category: string;
  baselineLoss: number;
  auditedLoss: number;
  recovered: number;
  progressPercent: number;
}

export interface DashboardDatabase {
  executiveKpis: ExecutiveKpi[];
  districtSummaries: DistrictSummary[];
  facilitySummaries: FacilitySummary[];
  feeSchedules: FeeSchedule[];
  facilityFeeMatrix: FacilityFeeMatrix[];
  auditChecks: AuditCheck[];
  discrepancies: DiscrepancyDetail[];
  monthlyTrends: MonthlyTrend[];
  procedureBreakdowns: ProcedureBreakdown[];
  rejectionCauses: RejectionCause[];
  payerPerformances: PayerPerformance[];
  revenueLeakages: RevenueLeakage[];
}
