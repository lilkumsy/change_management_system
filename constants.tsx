
import React from 'react';
import {
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  ArchiveBoxIcon,
  QueueListIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { CRStatus, User, UserRole, RiskLevel, TestResult } from './types';

export const STATUS_COLORS: Record<CRStatus, string> = {
  [CRStatus.INITIATED]: 'bg-orange-50 text-orange-700 border-orange-100',
  [CRStatus.TESTING_ASSIGNED]: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  [CRStatus.TESTING_COMPLETED]: 'bg-amber-50 text-amber-700 border-amber-200',
  [CRStatus.RISK_REVIEWED]: 'bg-brand-navy text-white border-brand-navy',
  [CRStatus.AWAITING_IT_APPROVAL]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [CRStatus.APPROVED_FOR_DEPLOYMENT]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [CRStatus.DEPLOYED]: 'bg-green-100 text-green-800 border-green-200',
  [CRStatus.DEPLOYMENT_FAILED]: 'bg-red-50 text-red-700 border-red-200',
  [CRStatus.CLOSED]: 'bg-slate-200 text-slate-600 border-slate-300',
};

export const STATUS_ICONS: Record<CRStatus, React.ReactNode> = {
  [CRStatus.INITIATED]: <QueueListIcon className="w-5 h-5" />,
  [CRStatus.TESTING_ASSIGNED]: <BeakerIcon className="w-5 h-5" />,
  [CRStatus.TESTING_COMPLETED]: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
  [CRStatus.RISK_REVIEWED]: <ShieldCheckIcon className="w-5 h-5" />,
  [CRStatus.AWAITING_IT_APPROVAL]: <CheckBadgeIcon className="w-5 h-5" />,
  [CRStatus.APPROVED_FOR_DEPLOYMENT]: <CheckBadgeIcon className="w-5 h-5" />,
  [CRStatus.DEPLOYED]: <RocketLaunchIcon className="w-5 h-5" />,
  [CRStatus.DEPLOYMENT_FAILED]: <XCircleIcon className="w-5 h-5" />,
  [CRStatus.CLOSED]: <ArchiveBoxIcon className="w-5 h-5" />,
};

export const MOCK_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'System Admin',
    roles: [UserRole.ADMIN],
    unit: 'ICT',
    email: 'simon.ayua@norrenpensions.com',
    phone: 'xxxx',
    status: 'active'
  },
];

export const MOCK_CR_DATA: any[] = [
  {
    id: 'CR-2025-8842',
    title: 'Core Banking Security Patch v4.2.1',
    vendorName: 'Fintech Solutions',
    versionNumber: 'v4.2.1-stable',
    environment: 'PRODUCTION',
    plannedStartDate: '2025-01-10',
    plannedEndDate: '2025-01-15',
    status: CRStatus.DEPLOYED,
    features: [
      {
        id: 'f-1',
        name: 'OAuth2 Implementation',
        description: 'Upgrade identity provider to support modern secure handshakes.',
        module: 'Identity',
        riskLevel: RiskLevel.HIGH,
        assignedTesterId: 'u-glory',
        status: 'Tested',
        testResult: TestResult.PASS,
        testObservations: 'Authentication tokens successfully validated across all nodes. Performance impact within 2ms threshold.',
        testTimestamp: '2025-01-12T10:00:00.000Z'
      },
      {
        id: 'f-2',
        name: 'Database Encryption At Rest',
        description: 'Enabling AES-256 for all PII data columns.',
        module: 'Database',
        riskLevel: RiskLevel.MEDIUM,
        assignedTesterId: 'u-light',
        status: 'Tested',
        testResult: TestResult.PASS,
        testObservations: 'Column encryption verified via direct SQL audit. Application performance remains stable.',
        testTimestamp: '2025-01-12T14:30:00.000Z'
      }
    ],
    riskAssessment: {
      decision: 'Accept',
      operationalRisk: 'Low - Phased rollout confirmed.',
      complianceRisk: 'High - Critical for ISO compliance.',
      reputationalRisk: 'Negligible',
      comments: 'Technical controls are sufficient. Backup verified before execution.',
      assessedBy: 'Efosa Sunday',
      timestamp: '2025-01-13T09:00:00.000Z'
    },
    itApproval: {
      approved: true,
      comments: 'Proceed with night-window deployment. Monitor latency closely.',
      approvedBy: 'Francis Aghedo',
      deploymentEngineerId: 'u-musa',
      plannedDeploymentDate: '2025-01-14T23:00',
      timestamp: '2025-01-13T16:00:00.000Z'
    },
    deployedBy: 'Musa Umaru',
    deployedAt: '2025-01-14T23:45:00.000Z',
    auditLogs: [
      { id: 'a-1', action: 'Production Deployment', user: 'Musa Umaru', timestamp: '2025-01-14T23:45:00.000Z', details: 'Migration script executed successfully on Node 1 & 2.' },
      { id: 'a-2', action: 'Executive Authorization', user: 'Francis Aghedo', timestamp: '2025-01-13T16:00:00.000Z', details: 'Final production sign-off granted.' },
      { id: 'a-3', action: 'Risk Certification', user: 'Efosa Sunday', timestamp: '2025-01-13T09:00:00.000Z', details: 'Change accepted for production.' }
    ],
    createdAt: '2025-01-10T08:00:00.000Z',
    createdBy: 'Simon Ayua',
    creatorId: 'u-simon'
  }
];
