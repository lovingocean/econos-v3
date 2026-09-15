export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';

export type BillingInterval = 'monthly' | 'annual';

export type SubscriptionStatus = 
  | 'FREE' 
  | 'TRIALING' 
  | 'ACTIVE' 
  | 'PAST_DUE' 
  | 'PAUSED' 
  | 'CANCELED' 
  | 'EXPIRED';

export interface PlanEntitlements {
  aiAdvisorLevel: 'limited' | 'enabled' | 'full';
  wealthEngines: 'limited' | 'full';
  maxAgents: number;
  maxSeats: number;
  maxMonthlyAiCalls: number;
  maxMonthlySimulations: number;
  maxScenarios?: number;
  supportLevel?: string;
  advancedTrust: boolean;
  aiFirewall: boolean;
  humanApprovalWorkflow: boolean;
  advancedAuditLogs: boolean;
  customPolicies: boolean;
  apiAccess: boolean;
  ssoSaml: boolean;
  dedicatedInfrastructure: boolean;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  targetAudience: string;
  monthlyPrice: number | null; // null for custom Enterprise
  annualPrice: number | null; // null for custom Enterprise
  currency: string;
  trialDays: number;
  isActive: boolean;
  features: string[];
  entitlements: PlanEntitlements;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  billingCustomerId: string;
  providerSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingCustomer {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  paymentMethodBrand?: string;
  paymentMethodLast4?: string;
  providerCustomerId: string;
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  organizationId: string;
  metric: 'ai_tokens' | 'ai_calls' | 'agent_executions' | 'simulations' | 'api_calls' | 'verification_proofs';
  quantity: number;
  costEstimateUsd: number;
  recordedAt: string;
  period: string; // YYYY-MM
}

export interface Invoice {
  id: string;
  organizationId: string;
  amountPaid: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  billingReason: 'subscription_create' | 'subscription_cycle' | 'subscription_update' | 'manual';
  invoicePdfUrl?: string;
  createdAt: string;
}

export interface PaymentEvent {
  id: string;
  organizationId: string;
  providerEventId: string;
  eventType: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'refunded';
  failureReason?: string;
  createdAt: string;
}

export interface SubscriptionEvent {
  id: string;
  organizationId: string;
  fromPlan: PlanId;
  toPlan: PlanId;
  eventType: 'CREATED' | 'TRIAL_STARTED' | 'UPGRADED' | 'DOWNGRADED' | 'CANCELED' | 'RENEWED' | 'EXPIRED' | 'PAST_DUE';
  reason: string;
  timestamp: string;
}

export interface ProcessedWebhookEvent {
  id: string;
  providerEventId: string;
  eventType: string;
  processedAt: string;
}

export interface AdminPricingAudit {
  id: string;
  adminUserId: string;
  planId: PlanId;
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
  timestamp: string;
}

export interface CommercialAnalytics {
  totalSignups: number;
  trialStarts: number;
  trialConversions: number;
  paidSubscriptions: number;
  upgrades: number;
  downgrades: number;
  cancellations: number;
  churnRate: number | null;
  mrr: number;
  arr: number;
  arpu: number | null;
  planDistribution: Record<PlanId, number>;
  activeOrganizations: number;
  activeAgents: number;
  totalAiUsage: number;
  totalUsageCost: number;
  grossMarginEstimate: number | null;
}

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
  upgradeRequiredPlan?: PlanId;
}
