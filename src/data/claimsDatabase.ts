/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardDatabase } from '../types';

export const INITIAL_DATABASE: DashboardDatabase = {
  executiveKpis: [
    { id: 'kpi_1', metricCode: 'REV_REC_01', metricName: 'Audit Claims Volume Evaluated', category: 'Volume', target: 50000, actual: 48650, achievePercent: 97.3, gap: -1350, status: 'On Track' },
    { id: 'kpi_2', metricCode: 'REV_REC_02', metricName: 'Revenue Leakage Prevented ($)', category: 'Revenue', target: 1500000, actual: 1240500, achievePercent: 82.7, gap: -259500, status: 'On Track' },
    { id: 'kpi_3', metricCode: 'REV_REC_03', metricName: 'Average Claim Audit Turnaround', category: 'Quality', target: 5.0, actual: 5.8, achievePercent: 86.2, gap: 0.8, status: 'At Risk' },
    { id: 'kpi_4', metricCode: 'REV_REC_04', metricName: 'Billing Compliance Score (%)', category: 'Compliance', target: 95.0, actual: 91.4, achievePercent: 96.2, gap: -3.6, status: 'On Track' },
    { id: 'kpi_5', metricCode: 'REV_REC_05', metricName: 'Systemic Code Upcoding Errors Saved', category: 'Revenue', target: 450000, actual: 389000, achievePercent: 86.4, gap: -61000, status: 'On Track' },
    { id: 'kpi_6', metricCode: 'REV_REC_06', metricName: 'Duplicate Claims Rate (%)', category: 'Compliance', target: 1.5, actual: 2.7, achievePercent: 55.6, gap: 1.2, status: 'Underperforming' },
    { id: 'kpi_7', metricCode: 'REV_REC_07', metricName: 'Facility Contract Rate Variance', category: 'Revenue', target: 200000, actual: 124000, achievePercent: 62.0, gap: -76000, status: 'At Risk' },
    { id: 'kpi_8', metricCode: 'REV_REC_08', metricName: 'High-Risk Providers Identified', category: 'Quality', target: 12, actual: 15, achievePercent: 125.0, gap: 3, status: 'On Track' },
    { id: 'kpi_9', metricCode: 'REV_REC_09', metricName: 'Patient Enrollment Integrity Matches', category: 'Compliance', target: 100, actual: 94, achievePercent: 94.0, gap: -6, status: 'On Track' },
    { id: 'kpi_10', metricCode: 'REV_REC_10', metricName: 'Audit System Uptime (%)', category: 'Quality', target: 99.9, actual: 99.7, achievePercent: 99.8, gap: -0.2, status: 'On Track' },
    { id: 'kpi_11', metricCode: 'REV_REC_11', metricName: 'Under-billing Recovery Captured', category: 'Revenue', target: 350000, actual: 184500, achievePercent: 52.7, gap: -165500, status: 'Critical' },
    { id: 'kpi_12', metricCode: 'REV_REC_12', metricName: 'Auditor Team Service SLA Met', category: 'Quality', target: 92.0, actual: 88.5, achievePercent: 96.2, gap: -3.5, status: 'At Risk' }
  ],

  districtSummaries: [
    { id: 'dist_1', districtId: 'DST-NORD', districtName: 'Northern Metro District', claimsSubmitted: 14500, claimsApproved: 13100, claimValue: 7250000, auditRejections: 420000, errorRate: 5.79, leakagePrevented: 350000 },
    { id: 'dist_2', districtId: 'DST-SOUT', districtName: 'Southern Coastal District', claimsSubmitted: 11200, claimsApproved: 9800, claimValue: 5800000, auditRejections: 560000, errorRate: 9.66, leakagePrevented: 290000 },
    { id: 'dist_3', districtId: 'DST-EAST', districtName: 'East Industrial District', claimsSubmitted: 12800, claimsApproved: 11900, claimValue: 6100000, auditRejections: 290000, errorRate: 4.75, leakagePrevented: 185000 },
    { id: 'dist_4', districtId: 'DST-WEST', districtName: 'Western Highland District', claimsSubmitted: 7850, claimsApproved: 7100, claimValue: 3950000, auditRejections: 310000, errorRate: 7.85, leakagePrevented: 162500 },
    { id: 'dist_5', districtId: 'DST-VALY', districtName: 'Central Valley District', claimsSubmitted: 6100, claimsApproved: 5650, claimValue: 2850000, auditRejections: 220000, errorRate: 7.72, leakagePrevented: 118000 },
    { id: 'dist_6', districtId: 'DST-FNT', districtName: 'Frontier Tribal District', claimsSubmitted: 2200, claimsApproved: 2020, claimValue: 1050000, auditRejections: 95000, errorRate: 9.05, leakagePrevented: 65000 }
  ],

  facilitySummaries: [
    { id: 'fac_1', facilityId: 'FAC_N1', facilityName: 'Northern General Hospital', districtName: 'Northern Metro District', level: 'Tertiary', keyProcedureType: 'Inpatient Surgical', baseFeeRate: 1250, volume: 4800, complianceRate: 94.2, riskScore: 12 },
    { id: 'fac_2', facilityId: 'FAC_S1', facilityName: 'Southern Coast Clinique', districtName: 'Southern Coastal District', level: 'Secondary', keyProcedureType: 'Outpatient Care', baseFeeRate: 450, volume: 3200, complianceRate: 85.5, riskScore: 58 },
    { id: 'fac_3', facilityId: 'FAC_E1', facilityName: 'Mercy Medical Center', districtName: 'East Industrial District', level: 'Tertiary', keyProcedureType: 'Complex Imaging', baseFeeRate: 850, volume: 5500, complianceRate: 92.1, riskScore: 24 },
    { id: 'fac_4', facilityId: 'FAC_W1', facilityName: 'Western Highlands Infirmary', districtName: 'Western Highland District', level: 'Primary', keyProcedureType: 'General Consultation', baseFeeRate: 180, volume: 3900, complianceRate: 88.4, riskScore: 42 },
    { id: 'fac_5', facilityId: 'FAC_C1', facilityName: 'Hope Health Center', districtName: 'Central Valley District', level: 'Secondary', keyProcedureType: 'Laboratories', baseFeeRate: 220, volume: 4600, complianceRate: 89.6, riskScore: 35 },
    { id: 'fac_6', facilityId: 'FAC_N2', facilityName: 'Metropolitan Family Center', districtName: 'Northern Metro District', level: 'Primary', keyProcedureType: 'Pediatric Care', baseFeeRate: 150, volume: 6200, complianceRate: 96.8, riskScore: 8 },
    { id: 'fac_7', facilityId: 'FAC_S2', facilityName: 'Seaside Memorial Hospital', districtName: 'Southern Coastal District', level: 'Tertiary', keyProcedureType: 'Cardiology Procedures', baseFeeRate: 2100, volume: 1850, complianceRate: 81.3, riskScore: 78 },
    { id: 'fac_8', facilityId: 'FAC_E2', facilityName: 'Industrial Zone Health Base', districtName: 'East Industrial District', level: 'Primary', keyProcedureType: 'Occupational Therapy', baseFeeRate: 190, volume: 2100, complianceRate: 91.5, riskScore: 29 },
    { id: 'fac_9', facilityId: 'FAC_W2', facilityName: 'Highlands Community Ward', districtName: 'Western Highland District', level: 'Primary', keyProcedureType: 'General Consultation', baseFeeRate: 140, volume: 1550, complianceRate: 90.2, riskScore: 31 },
    { id: 'fac_10', facilityId: 'FAC_V1', facilityName: 'Valley Outpatient Sanitarium', districtName: 'Central Valley District', level: 'Secondary', keyProcedureType: 'Orthopedic Diagnostics', baseFeeRate: 580, volume: 1500, complianceRate: 87.7, riskScore: 48 },
    { id: 'fac_11', facilityId: 'FAC_F1', facilityName: 'Sovereign Mountain Clinic', districtName: 'Frontier Tribal District', level: 'Primary', keyProcedureType: 'Emergency Triage', baseFeeRate: 240, volume: 1200, complianceRate: 84.1, riskScore: 65 },
    { id: 'fac_12', facilityId: 'FAC_N3', facilityName: 'National Health Clinic', districtName: 'Northern Metro District', level: 'Secondary', keyProcedureType: 'Mental Wellness', baseFeeRate: 320, volume: 2200, complianceRate: 95.1, riskScore: 15 }
  ],

  feeSchedules: [
    { id: 'fee_1', code: '99213', description: 'Outpatient Doctor Office Visit (Low/Moderate Severity)', category: 'Consultation', standardAllowed: 120, actualCharged: 135, deviationPercent: 12.5, riskLevel: 'Medium' },
    { id: 'fee_2', code: '99214', description: 'Outpatient Doctor Office Visit (High Severity)', category: 'Consultation', standardAllowed: 185, actualCharged: 195, deviationPercent: 5.4, riskLevel: 'Low' },
    { id: 'fee_3', code: '36415', description: 'Collection of Venous Blood by Venipuncture', category: 'Laboratory', standardAllowed: 15, actualCharged: 28, deviationPercent: 86.7, riskLevel: 'High' },
    { id: 'fee_4', code: '93000', description: 'Electrocardiogram (ECG/EKG) Tracing, Interpretation', category: 'Imaging', standardAllowed: 75, actualCharged: 110, deviationPercent: 46.7, riskLevel: 'High' },
    { id: 'fee_5', code: '70450', description: 'CT Scan (Computed Tomography) Head/Brain without Contrast', category: 'Imaging', standardAllowed: 350, actualCharged: 480, deviationPercent: 37.1, riskLevel: 'High' },
    { id: 'fee_6', code: '45378', description: 'Diagnostic Colonoscopy of Proximal Colon', category: 'Surgery', standardAllowed: 950, actualCharged: 980, deviationPercent: 3.2, riskLevel: 'Low' },
    { id: 'fee_7', code: '80053', description: 'Comprehensive Metabolic Panel (CMP) Blood Test', category: 'Laboratory', standardAllowed: 40, actualCharged: 62, deviationPercent: 55.0, riskLevel: 'High' },
    { id: 'fee_8', code: '99283', description: 'Emergency Department Visit (Moderate Severity)', category: 'Consultation', standardAllowed: 280, actualCharged: 315, deviationPercent: 12.5, riskLevel: 'Medium' },
    { id: 'fee_9', code: '27130', description: 'Total Hip Arthroplasty (Replacement Surgery)', category: 'Surgery', standardAllowed: 6400, actualCharged: 6600, deviationPercent: 3.1, riskLevel: 'Low' },
    { id: 'fee_10', code: '85025', description: 'Complete Blood Count (CBC) with Automated Differential', category: 'Laboratory', standardAllowed: 22, actualCharged: 25, deviationPercent: 13.6, riskLevel: 'Low' },
    { id: 'fee_11', code: '74177', description: 'CT Scan Abdomen and Pelvis with Contrast', category: 'Imaging', standardAllowed: 650, actualCharged: 780, deviationPercent: 20.0, riskLevel: 'Medium' },
    { id: 'fee_12', code: 'J3490', description: 'Unclassified Single-Dose Prescribed Therapeutic Drugs', category: 'Pharmacy', standardAllowed: 110, actualCharged: 195, deviationPercent: 77.3, riskLevel: 'High' }
  ],

  facilityFeeMatrix: [
    { id: 'mat_1', code: '99213', description: 'Outpatient Mid Visit', generalHospital: 160, districtClinic: 95, mercyMedical: 145, hopeHealthCenter: 115, nationalClinic: 110 },
    { id: 'mat_2', code: '99214', description: 'Outpatient Extended Visit', generalHospital: 240, districtClinic: 140, mercyMedical: 210, hopeHealthCenter: 175, nationalClinic: 165 },
    { id: 'mat_3', code: '36415', description: 'Venipuncture Blood Draw', generalHospital: 45, districtClinic: 15, mercyMedical: 35, hopeHealthCenter: 18, nationalClinic: 22 },
    { id: 'mat_4', code: '93000', description: 'Electrocardiogram Detail', generalHospital: 150, districtClinic: 65, mercyMedical: 120, hopeHealthCenter: 80, nationalClinic: 85 },
    { id: 'mat_5', code: '70450', description: 'CT Scan Head/Brain', generalHospital: 620, districtClinic: 280, mercyMedical: 510, hopeHealthCenter: 390, nationalClinic: 360 },
    { id: 'mat_6', code: '45378', description: 'Diagnostic Colonoscopy', generalHospital: 1350, districtClinic: 780, mercyMedical: 1150, hopeHealthCenter: 900, nationalClinic: 850 },
    { id: 'mat_7', code: '80053', description: 'Metabolic Blood Panel', generalHospital: 95, districtClinic: 32, mercyMedical: 78, hopeHealthCenter: 44, nationalClinic: 48 },
    { id: 'mat_8', code: '99283', description: 'Emergency Med Severity', generalHospital: 480, districtClinic: 190, mercyMedical: 380, hopeHealthCenter: 240, nationalClinic: 270 },
    { id: 'mat_9', code: '27130', description: 'Total Hip Arthroplasty', generalHospital: 8500, districtClinic: 4900, mercyMedical: 7200, hopeHealthCenter: 5800, nationalClinic: 6100 },
    { id: 'mat_10', code: '85025', description: 'CBC Complete Blood Count', generalHospital: 38, districtClinic: 18, mercyMedical: 29, hopeHealthCenter: 20, nationalClinic: 21 },
    { id: 'mat_11', code: '74177', description: 'CT Scan Abdomen/Pelvis', generalHospital: 1100, districtClinic: 520, mercyMedical: 940, hopeHealthCenter: 710, nationalClinic: 680 },
    { id: 'mat_12', code: 'J3490', description: 'Unclassified Drugs Spec', generalHospital: 320, districtClinic: 85, mercyMedical: 260, hopeHealthCenter: 120, nationalClinic: 140 }
  ],

  auditChecks: [
    { id: 'chk_1', checkId: 'AC-DUP-01', checkName: 'Double Encounter Billing on Same DOS', category: 'Duplicate', rulesRun: 124000, claimsFlagged: 412, potentialSavings: 145000, priority: 'Critical' },
    { id: 'chk_2', checkId: 'AC-UNB-02', checkName: 'Surgical Gowns & Trays Unbundled Billing', category: 'Unbundling', rulesRun: 85000, claimsFlagged: 924, potentialSavings: 310000, priority: 'High' },
    { id: 'chk_3', checkId: 'AC-UPC-03', checkName: 'High Complexity Visit (99215) Upcoding Audit', category: 'Upcoding', rulesRun: 94500, claimsFlagged: 512, potentialSavings: 284000, priority: 'High' },
    { id: 'chk_4', checkId: 'AC-AGE-04', checkName: 'Pediatric Vaccine Administered to Seniors', category: 'Age Conflict', rulesRun: 112000, claimsFlagged: 89, potentialSavings: 34000, priority: 'Medium' },
    { id: 'chk_5', checkId: 'AC-POL-05', checkName: 'Exceeding Max Allowed Annual Physicals', category: 'Policy Limit', rulesRun: 76000, claimsFlagged: 184, potentialSavings: 72000, priority: 'Low' },
    { id: 'chk_6', checkId: 'AC-UNB-06', checkName: 'Lab Panels Unbundled into Separate Components', category: 'Unbundling', rulesRun: 115000, claimsFlagged: 1420, potentialSavings: 195000, priority: 'High' },
    { id: 'chk_7', checkId: 'AC-UPC-07', checkName: 'General Outpatient Upgrade to Emergency Codes', category: 'Upcoding', rulesRun: 58000, claimsFlagged: 290, potentialSavings: 154500, priority: 'Critical' },
    { id: 'chk_8', checkId: 'AC-DUP-08', checkName: 'Continuous Multi-Day Imaging Duplication', category: 'Duplicate', rulesRun: 42000, claimsFlagged: 55, potentialSavings: 46000, priority: 'Medium' }
  ],

  discrepancies: [
    { id: 'disc_1', claimId: 'CLM-770812', patientName: 'Arthur Dent', provider: 'Southern Coast Clinique', date: '2026-05-18', procedureCode: '36415', chargedAmount: 45, allowedAmount: 15, conflictReason: 'Duplicate charges for basic blood draw on identical session timestamp.', status: 'Pending Review' },
    { id: 'disc_2', claimId: 'CLM-992113', patientName: 'Ellen Ripley', provider: 'Mercy Medical Center', date: '2026-05-20', procedureCode: '99214', allowedAmount: 185, chargedAmount: 260, conflictReason: 'Billed code deviates by more than 40% from standard contract schedule ceiling.', status: 'Approved' },
    { id: 'disc_3', claimId: 'CLM-104928', patientName: 'John Connor', provider: 'Valley Outpatient Sanitarium', date: '2026-05-24', procedureCode: '70450', allowedAmount: 350, chargedAmount: 490, conflictReason: 'Unbundled head scan billed alongside diagnostic emergency service panel.', status: 'Corrected' },
    { id: 'disc_4', claimId: 'CLM-898711', patientName: 'Sarah Connor', provider: 'Seaside Memorial Hospital', date: '2026-05-26', procedureCode: '99213', allowedAmount: 120, chargedAmount: 210, conflictReason: 'Upcoded outpatient mid-level visit. Provider clinical notes support basic consultation.', status: 'Pending Review' },
    { id: 'disc_5', claimId: 'CLM-454512', patientName: 'Bruce Wayne', provider: 'Northern General Hospital', date: '2026-05-29', procedureCode: 'J3490', allowedAmount: 110, chargedAmount: 320, conflictReason: 'Pharmacy unclassified drug exceeded regional maximum allowed multiplier.', status: 'Rejected' },
    { id: 'disc_6', claimId: 'CLM-665123', patientName: 'Clark Kent', provider: 'Hope Health Center', date: '2026-06-01', procedureCode: '36415', allowedAmount: 15, chargedAmount: 35, conflictReason: 'Double encounter blood collection logged 10 minutes apart.', status: 'Corrected' },
    { id: 'disc_7', claimId: 'CLM-200987', patientName: 'Diana Prince', provider: 'Sovereign Mountain Clinic', date: '2026-06-03', procedureCode: '99283', allowedAmount: 280, chargedAmount: 380, conflictReason: 'Billed emergency visit during general clinic business hours.', status: 'Pending Review' },
    { id: 'disc_8', claimId: 'CLM-505412', patientName: 'Peter Parker', provider: 'Metropolitan Family Center', date: '2026-06-05', procedureCode: '93000', allowedAmount: 75, chargedAmount: 110, conflictReason: 'Upcoded ECG interpretation from regular trace code.', status: 'Approved' },
    { id: 'disc_9', claimId: 'CLM-112233', patientName: 'Tony Stark', provider: 'Industrial Zone Health Base', date: '2026-06-08', procedureCode: '80053', allowedAmount: 40, chargedAmount: 95, conflictReason: 'Comprehensive blood panel billing exceeded the commercial tier schedule.', status: 'Pending Review' },
    { id: 'disc_10', claimId: 'CLM-445566', patientName: 'Bruce Banner', provider: 'Seaside Memorial Hospital', date: '2026-06-10', procedureCode: '27130', allowedAmount: 6400, chargedAmount: 8500, conflictReason: 'Orthopedic surgical bundle unbundled into separate standard room fees.', status: 'Pending Review' }
  ],

  monthlyTrends: [
    { id: 'trend_1', month: 'Jul', year: 2025, inpatientVolume: 1200, outpatientVolume: 7400, inpatientClaimValue: 2400000, outpatientClaimValue: 1450000 },
    { id: 'trend_2', month: 'Aug', year: 2025, inpatientVolume: 1310, outpatientVolume: 7800, inpatientClaimValue: 2600000, outpatientClaimValue: 1580000 },
    { id: 'trend_3', month: 'Sep', year: 2025, inpatientVolume: 1150, outpatientVolume: 8200, inpatientClaimValue: 2320000, outpatientClaimValue: 1720000 },
    { id: 'trend_4', month: 'Oct', year: 2025, inpatientVolume: 1420, outpatientVolume: 8900, inpatientClaimValue: 2900000, outpatientClaimValue: 1850000 },
    { id: 'trend_5', month: 'Nov', year: 2025, inpatientVolume: 1350, outpatientVolume: 9200, inpatientClaimValue: 2750000, outpatientClaimValue: 1940000 },
    { id: 'trend_6', month: 'Dec', year: 2025, inpatientVolume: 1510, outpatientVolume: 9900, inpatientClaimValue: 3100000, outpatientClaimValue: 2100000 },
    { id: 'trend_7', month: 'Jan', year: 2026, inpatientVolume: 1250, outpatientVolume: 8100, inpatientClaimValue: 2550000, outpatientClaimValue: 1650000 },
    { id: 'trend_8', month: 'Feb', year: 2026, inpatientVolume: 1180, outpatientVolume: 8300, inpatientClaimValue: 2420000, outpatientClaimValue: 1700000 },
    { id: 'trend_9', month: 'Mar', year: 2026, inpatientVolume: 1300, outpatientVolume: 8950, inpatientClaimValue: 2680000, outpatientClaimValue: 1880000 },
    { id: 'trend_10', month: 'Apr', year: 2026, inpatientVolume: 1450, outpatientVolume: 9400, inpatientClaimValue: 2980000, outpatientClaimValue: 1990000 },
    { id: 'trend_11', month: 'May', year: 2026, inpatientVolume: 1490, outpatientVolume: 9800, inpatientClaimValue: 3080000, outpatientClaimValue: 2050000 },
    { id: 'trend_12', month: 'Jun', year: 2026, inpatientVolume: 1550, outpatientVolume: 10400, inpatientClaimValue: 3200000, outpatientClaimValue: 2200000 }
  ],

  procedureBreakdowns: [
    { id: 'break_1', procedureCategory: 'Consultation & Visits', claimCount: 18400, totalValue: 4620000, leakageAmount: 389000, auditedCodeCount: 790 },
    { id: 'break_2', procedureCategory: 'Diagnostic Imaging', claimCount: 6200, totalValue: 3850000, leakageAmount: 260500, auditedCodeCount: 462 },
    { id: 'break_3', procedureCategory: 'Laboratory Evaluation', claimCount: 22100, totalValue: 2450000, leakageAmount: 295000, auditedCodeCount: 1180 },
    { id: 'break_4', procedureCategory: 'Inpatient Surgical Bundle', claimCount: 1450, totalValue: 9280000, leakageAmount: 184000, auditedCodeCount: 125 },
    { id: 'break_5', procedureCategory: 'Therapeutic Pharmacy', claimCount: 10500, totalValue: 3100000, leakageAmount: 112000, auditedCodeCount: 380 }
  ],

  rejectionCauses: [
    { id: 'rej_1', rootCauseReason: 'Unbundled Service Code Over-Claims', percentage: 34.5, count: 1820, dollarImpact: 395000, systemRemediation: 'Auto-combine component lines to primary bundled package in claim logic engines.' },
    { id: 'rej_2', rootCauseReason: 'Code Severity Upcoding Identification', percentage: 25.8, count: 1210, dollarImpact: 284000, systemRemediation: 'Cross-reference and validate billing with primary diagnostic code ICD-10 notes.' },
    { id: 'rej_3', rootCauseReason: 'Member Eligibility & Active Status Mismatch', percentage: 16.2, count: 854, dollarImpact: 194000, systemRemediation: 'Deploy real-time enrollment checks and webhooks to payer databases before dispatch.' },
    { id: 'rej_4', rootCauseReason: 'Encounter Record Duplication', percentage: 14.8, count: 712, dollarImpact: 145000, systemRemediation: 'Block identical provider-DOS-patient submission with timestamp threshold checks.' },
    { id: 'rej_5', rootCauseReason: 'Missing Prior Authorization Forms', percentage: 8.7, count: 410, dollarImpact: 64000, systemRemediation: 'Mandate digital attachment upload for authorization-tagged CPT categories.' }
  ],

  payerPerformances: [
    { id: 'payer_1', payerName: 'Federal Health Commission (FHC)', totalPaidClaims: 18500, denialRate: 4.8, avgDaysToPay: 14.2, overpaymentRate: 1.1, underpaymentRate: 2.1 },
    { id: 'payer_2', payerName: 'Blue Shield Coalition', totalPaidClaims: 12400, denialRate: 8.5, avgDaysToPay: 28.5, overpaymentRate: 3.4, underpaymentRate: 1.5 },
    { id: 'payer_3', payerName: 'Vanguard Medical Assurances', totalPaidClaims: 9800, denialRate: 11.2, avgDaysToPay: 35.0, overpaymentRate: 5.8, underpaymentRate: 0.8 },
    { id: 'payer_4', payerName: 'Apex Health Partners', totalPaidClaims: 5400, denialRate: 6.4, avgDaysToPay: 19.8, overpaymentRate: 2.1, underpaymentRate: 1.9 },
    { id: 'payer_5', payerName: 'Provident Life Care', totalPaidClaims: 2200, denialRate: 14.5, avgDaysToPay: 42.1, overpaymentRate: 7.2, underpaymentRate: 0.5 }
  ],

  revenueLeakages: [
    { id: 'leak_1', category: 'Unbundled Modifier Cheating', baselineLoss: 450000, auditedLoss: 140000, recovered: 310000, progressPercent: 68.9 },
    { id: 'leak_2', category: 'Upcoded Consultation Levels', baselineLoss: 380000, auditedLoss: 96000, recovered: 284000, progressPercent: 74.7 },
    { id: 'leak_3', category: 'Undetected Double Billing', baselineLoss: 210000, auditedLoss: 65000, recovered: 145000, progressPercent: 69.0 },
    { id: 'leak_4', category: 'Ineligible Patient Claims', baselineLoss: 190000, auditedLoss: 96000, recovered: 94000, progressPercent: 49.5 },
    { id: 'leak_5', category: 'Contract Rate Over-charges', baselineLoss: 180000, auditedLoss: 56000, recovered: 124000, progressPercent: 68.9 },
    { id: 'leak_6', category: 'Under-billing / Missed Services', baselineLoss: 350000, auditedLoss: 165500, recovered: 184500, progressPercent: 52.7 }
  ]
};

// Simple localized persistent manager using state or local storage
export function getSavedDatabase(): DashboardDatabase {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('claim_dashboard_db_pro5');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse saved database state', e);
      }
    }
  }
  return { ...INITIAL_DATABASE };
}

export function saveDatabase(db: DashboardDatabase) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('claim_dashboard_db_pro5', JSON.stringify(db));
  }
}

export function resetDatabase(): DashboardDatabase {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('claim_dashboard_db_pro5');
  }
  return { ...INITIAL_DATABASE };
}
