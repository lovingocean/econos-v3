export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  currentOrgId: string;
  avatarUrl?: string;
  createdAt: string;
  password?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isDemo: boolean;
  ownerId: string;
  createdAt: string;
  tier: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
}

export interface Business {
  id: string;
  organizationId: string;
  name: string;
  industry: string;
  currency: string;
  fiscalYearEnd: string;
  createdAt: string;
}

export interface EconomicProfile {
  id: string;
  businessId: string;
  organizationId: string;
  monthlyRevenue: number | null;
  monthlyCogs: number | null;
  monthlyOpex: number | null;
  cashOnHand: number | null;
  totalAssets: number | null;
  totalLiabilities: number | null;
  activeCustomersCount: number | null;
  activeSuppliersCount: number | null;
  netBurnRate: number | null;
  runwayMonths: number | null;
  grossMarginPct: number | null;
  netMarginPct: number | null;
  growthRateMoM: number | null;
  primaryObjective: string;
  keyRisks: string[];
  updatedAt: string;
}

export type OpportunityCategory = 
  | 'REVENUE_EXPANSION' 
  | 'COST_OPTIMIZATION' 
  | 'WORKING_CAPITAL' 
  | 'PRICING_STRATEGY' 
  | 'SUPPLIER_RENEGOTIATION' 
  | 'PRODUCTIVITY_AUTOMATION';

export type OpportunityStatus = 
  | 'DISCOVERED' 
  | 'ANALYZED' 
  | 'SIMULATED' 
  | 'RECOMMENDED' 
  | 'APPROVED' 
  | 'EXECUTING' 
  | 'COMPLETED' 
  | 'VERIFIED' 
  | 'LEARNED';

export interface Opportunity {
  id: string;
  businessId: string;
  organizationId: string;
  title: string;
  description: string;
  source: string;
  category: OpportunityCategory;
  estimatedImpact: number;
  confidence: number; // 0 to 1
  probability: number; // 0 to 1
  capitalRequired: number;
  timeRequiredWeeks: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assumptions: string[];
  expectedOutcome: string;
  status: OpportunityStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  businessId: string;
  organizationId: string;
  name: string;
  description: string;
  revenueAdjustmentPct: number;
  cogsAdjustmentPct: number;
  opexAdjustmentPct: number;
  newHiresCount: number;
  averageSalary: number;
  capitalInvestment: number;
  priceIncreasePct: number;
  projectedRevenue: number;
  projectedNetProfit: number;
  projectedRunwayMonths: number;
  facts: string[];
  assumptions: string[];
  estimates: string[];
  projections: string[];
  recommendation: string;
  createdAt: string;
}

export interface OutcomeVerification {
  id: string;
  businessId: string;
  organizationId: string;
  opportunityId: string;
  recommendationTitle: string;
  actionTaken: string;
  expectedFinancialImpact: number;
  actualFinancialImpact: number;
  variance: number;
  variancePercentage: number;
  verificationEvidence: string;
  verifiedAt: string;
  verifiedBy: string;
  isVerified: boolean;
  learningInsights: string;
  status: 'PENDING' | 'VERIFIED' | 'DISPUTED';
}

// Application Navigation Layers
export type AppLayer = 'BUSINESS' | 'WEALTH' | 'TRUST' | 'GRAPH';

// Layer 2: Wealth Types
export type WealthEngineCategory = 
  | 'INTELLIGENCE' 
  | 'EXPANSION' 
  | 'ALLOCATION' 
  | 'OPTIMIZATION' 
  | 'PROTECTION' 
  | 'DEFENSE' 
  | 'ACCELERATION';

export interface WealthProfile {
  id: string;
  userId: string;
  organizationId: string;
  liquidAssets: number | null;
  illiquidAssets: number | null;
  businessEquityValue: number | null;
  totalPersonalDebt: number | null;
  passiveMonthlyIncome: number | null;
  activeMonthlyIncome: number | null;
  monthlyPersonalExpenses: number | null;
  targetNetWorth: number;
  targetRetirementAge: number;
  currentAge: number;
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  updatedAt: string;
}

export interface WealthEngineItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: 'EXPANSION' | 'ALLOCATION' | 'OPTIMIZATION' | 'PROTECTION' | 'INTELLIGENCE';
  status: 'ACTIVE' | 'OPTIMAL' | 'ATTENTION_REQUIRED' | 'SIMULATING';
  score: number; // 0-100
  metricLabel: string;
  metricValue: string;
  keyFinding: string;
  recommendedAction: string;
}

export interface WealthAdvisorMessage {
  id: string;
  sender: 'USER' | 'ADVISOR';
  content: string;
  timestamp: string;
  meta?: {
    wealthGoal?: string;
    trajectory?: string;
    largestConstraint?: string;
    confidence?: number;
    assumptions?: string[];
    risks?: string[];
    recommendedAction?: string;
    projectedImpact?: number;
  };
}

// Layer 3: Trust Types
export type AgentStatus = 'ACTIVE' | 'PAUSED' | 'FROZEN' | 'DISABLED' | 'REVOKED';
export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AutonomyLevel = 'SUPERVISED' | 'CONDITIONAL' | 'AUTONOMOUS';

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status: AgentStatus;
  version: string;
  modelProvider: string;
  model: string;
  capabilities: string[];
  permissions: string[];
  riskTier: RiskTier;
  trustScore: number | null; // null represents INSUFFICIENT DATA
  reputationScore: number;
  autonomyLevel: AutonomyLevel;
  totalActionsExecuted: number;
  successfulActions: number;
  incidentCount: number;
  spendingLimitMonthly: number;
  lastActivityAt: string;
  lastIncidentAt: string | null;
  createdAt: string;
  passportId: string;
}

export interface EconomicPassport {
  passportId: string;
  agentId: string;
  agentName: string;
  organizationId: string;
  organizationName: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  cryptographicSignature: string;
  verifiedIdentity: boolean;
  currentTrustScore: number | null;
  reputationRating: string;
  riskClassification: RiskTier;
  economicAuthorityLimitUsd: number;
  verifiedOutcomesCount: number;
  activeIncidentsCount: number;
  permittedTools: string[];
  jurisdictionRestrictions: string[];
}

export interface AgentApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  organizationId: string;
  intent: string;
  actionName: string;
  toolName: string;
  requestedPermission: string;
  financialImpact: number;
  riskTier: RiskTier;
  affectedResource: string;
  reasoning: string;
  evidence: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  decisionNotes?: string;
}

export interface AgentIncident {
  id: string;
  agentId: string;
  agentName: string;
  organizationId: string;
  severity: RiskTier;
  category: string;
  description: string;
  detectedAt: string;
  source: string;
  actionAttempted: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  relatedAuditId?: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  agentId?: string;
  agentName?: string;
  action: string;
  resource: string;
  riskTier: RiskTier;
  decision: 'ALLOWED' | 'MONITORED' | 'ESCALATED' | 'BLOCKED';
  result: 'SUCCESS' | 'FAILURE' | 'PENDING_APPROVAL';
  timestamp: string;
  details: string;
}

export interface FirewallPipelineStage {
  stage: number;
  name: string;
  status: 'PASSED' | 'BLOCKED' | 'ESCALATED';
  details: string;
}

export interface FirewallDecision {
  decisionCode: 'ALLOWED' | 'BLOCKED' | 'ESCALATED';
  reason: string;
  riskTier: RiskTier;
  executed: boolean;
  pipelineStages: FirewallPipelineStage[];
  auditLogId: string;
  timestamp: string;
  approvalRequestId?: string;
}

export interface PolicyRule {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: 'FINANCIAL' | 'SECURITY' | 'DATA_ACCESS' | 'TEMPORAL';
  thresholdValue?: number;
  enforcement: 'BLOCK' | 'REQUIRE_APPROVAL' | 'LOG_ALERT';
  isActive: boolean;
}

// Economic Graph Types
export interface GraphNode {
  id: string;
  label: string;
  type: 'PERSON' | 'ORGANIZATION' | 'BUSINESS' | 'REVENUE' | 'ASSET' | 'LIABILITY' | 'OPPORTUNITY' | 'AGENT' | 'OUTCOME';
  value?: string;
  status?: string;
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation?: string;
  relationship?: string;
  verified?: boolean;
  financialImpact?: number;
}

export type EconomicGraphNode = GraphNode;
export type EconomicGraphEdge = GraphEdge;

export interface EconomicGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export * from './billing';
