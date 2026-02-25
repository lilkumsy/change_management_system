
export enum CRStatus {
  INITIATED = 'Initiated',
  TESTING_ASSIGNED = 'Testing Assigned',
  TESTING_COMPLETED = 'Testing Completed',
  RISK_REVIEWED = 'Risk Reviewed',
  AWAITING_IT_APPROVAL = 'Awaiting IT Approval',
  APPROVED_FOR_DEPLOYMENT = 'Approved for Deployment',
  DEPLOYED = 'Deployed',
  DEPLOYMENT_FAILED = 'Deployment Failed',
  CLOSED = 'Closed'
}

export enum UserRole {
  DB_TEAM = 'DB Team',
  TESTER = 'Unit Tester',
  RISK_TEAM = 'Risk Team',
  HEAD_OF_IT = 'Head of IT',
  DEPLOYMENT_ENGINEER = 'Deployment Engineer',
  ADMIN = 'System Admin'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TestResult {
  PASS = 'Pass',
  FAIL = 'Fail',
  CONDITIONAL = 'Conditional',
  PENDING = 'Pending'
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'approval' | 'deployment' | 'alert';
  link?: string;
}

export interface ChangeFeature {
  id: string;
  name: string;
  description: string;
  module: string;
  riskLevel: RiskLevel;
  assignedTesterId: string;
  status: 'Pending' | 'Tested';
  testResult?: TestResult;
  testObservations?: string;
  testScreenshot?: string;
  testTimestamp?: string;
}

export interface RiskAssessment {
  decision: 'Accept' | 'Mitigate' | 'Reject' | 'Pending';
  operationalRisk: string;
  complianceRisk: string;
  reputationalRisk: string;
  comments: string;
  assessedBy: string;
  timestamp: string;
}

export interface ITApproval {
  approved: boolean;
  comments: string;
  approvedBy: string;
  deploymentEngineerId?: string;
  plannedDeploymentDate?: string;
  timestamp: string;
}

export interface ChangeRequest {
  id: string;
  title: string;
  vendorName: string;
  versionNumber: string;
  environment: string;
  releaseNoteUrl?: string;
  releaseNoteContent?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: CRStatus;
  features: ChangeFeature[];
  riskAssessment?: RiskAssessment;
  itApproval?: ITApproval;
  deploymentLogs?: string;
  deployedBy?: string;
  deployedAt?: string;
  auditLogs: AuditEntry[];
  createdAt: string;
  createdBy: string;
  creatorId?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  roles: UserRole[];
  unit?: string;
  email: string;
  phone: string;
  password?: string;
  status?: 'active' | 'disabled';
  signature?: string; // Base64 encoded signature image
}
