import { db } from './db';
import { 
  PlanId, 
  PlanEntitlements, 
  PricingPlan, 
  Subscription, 
  EntitlementCheckResult 
} from '../src/types/billing';

export class EntitlementEngine {
  /**
   * Retrieves current authoritative subscription for an organization.
   * Auto-provisions FREE subscription if none exists.
   */
  public getSubscription(orgId: string): Subscription {
    let sub = db.getSubscriptionByOrg(orgId);
    if (!sub) {
      const org = db.getOrganizationById(orgId);
      const initialPlanId: PlanId = org?.tier ? (org.tier.toLowerCase() as PlanId) : 'free';
      sub = db.createOrUpdateSubscription({
        organizationId: orgId,
        planId: initialPlanId,
        status: 'ACTIVE',
        billingInterval: 'monthly',
        cancelAtPeriodEnd: false,
        billingCustomerId: `cus_${orgId}`
      });
    }
    return sub;
  }

  /**
   * Authoritative Plan definition for an organization
   */
  public getPlan(orgId: string): PricingPlan {
    const sub = this.getSubscription(orgId);
    const plan = db.getPricingPlanById(sub.planId);
    if (!plan) {
      return db.getPricingPlanById('free')!;
    }
    return plan;
  }

  /**
   * Retrieve active entitlements for an organization
   */
  public getEntitlements(orgId: string): PlanEntitlements {
    const plan = this.getPlan(orgId);
    const sub = this.getSubscription(orgId);

    // If subscription is expired or past_due without grace, throttle to free
    if (sub.status === 'EXPIRED' || sub.status === 'CANCELED') {
      const freePlan = db.getPricingPlanById('free');
      return freePlan ? freePlan.entitlements : plan.entitlements;
    }

    return plan.entitlements;
  }

  /**
   * Check whether a specific boolean or level capability is enabled
   */
  public hasCapability(orgId: string, capability: keyof PlanEntitlements): boolean {
    const entitlements = this.getEntitlements(orgId);
    const val = entitlements[capability];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val !== 'limited';
    if (typeof val === 'number') return val > 0;
    return Boolean(val);
  }

  /**
   * Enforce capability check server-side. Throws standard Error if forbidden.
   */
  public enforceCapability(orgId: string, capability: keyof PlanEntitlements, featureName?: string) {
    const allowed = this.hasCapability(orgId, capability);
    if (!allowed) {
      const plan = this.getPlan(orgId);
      const name = featureName || String(capability);
      throw new Error(
        `Feature "${name}" is not included in your current ${plan.name} plan. Upgrade your plan to unlock this capability.`
      );
    }
  }

  /**
   * Check resource bounds (e.g. Agent limits, Seat limits, Simulation limits)
   */
  public checkLimit(
    orgId: string, 
    limitKey: 'maxAgents' | 'maxSeats' | 'maxMonthlyAiCalls' | 'maxMonthlySimulations', 
    currentCount: number
  ): EntitlementCheckResult {
    const entitlements = this.getEntitlements(orgId);
    const plan = this.getPlan(orgId);
    const max = entitlements[limitKey] ?? 0;

    if (currentCount >= max) {
      return {
        allowed: false,
        currentUsage: currentCount,
        limit: max,
        reason: `Reached maximum limit of ${max} for ${limitKey} on ${plan.name} plan.`,
        upgradeRequiredPlan: plan.id === 'free' ? 'pro' : plan.id === 'pro' ? 'business' : 'enterprise'
      };
    }

    return {
      allowed: true,
      currentUsage: currentCount,
      limit: max
    };
  }

  /**
   * Enforce resource bounds strictly on creation/mutation
   */
  public enforceResourceLimit(
    orgId: string, 
    limitKey: 'maxAgents' | 'maxSeats', 
    currentCount: number,
    resourceLabel?: string
  ) {
    const check = this.checkLimit(orgId, limitKey, currentCount);
    if (!check.allowed) {
      const label = resourceLabel || (limitKey === 'maxAgents' ? 'AI Agents' : 'Team Members');
      throw new Error(
        `Limit exceeded: You have reached the maximum of ${check.limit} ${label} allowed on your current plan. Please upgrade to add more.`
      );
    }
  }

  /**
   * Record usage for billing/analytics (e.g. AI calls, simulations, agent actions)
   */
  public recordUsage(
    orgId: string,
    metric: 'ai_tokens' | 'ai_calls' | 'agent_executions' | 'simulations' | 'api_calls' | 'verification_proofs',
    quantity: number,
    unitCostUsd: number = 0.0001
  ) {
    const period = new Date().toISOString().slice(0, 7); // YYYY-MM
    return db.recordUsage({
      organizationId: orgId,
      metric,
      quantity,
      costEstimateUsd: Number((quantity * unitCostUsd).toFixed(4)),
      period
    });
  }

  /**
   * Compute usage aggregates for current period
   */
  public getUsageSummary(orgId: string, period?: string) {
    const activePeriod = period || new Date().toISOString().slice(0, 7);
    const records = db.getUsageRecords(orgId, activePeriod);
    
    const summary: Record<string, { quantity: number; costEstimateUsd: number }> = {};
    for (const r of records) {
      if (!summary[r.metric]) {
        summary[r.metric] = { quantity: 0, costEstimateUsd: 0 };
      }
      summary[r.metric].quantity += r.quantity;
      summary[r.metric].costEstimateUsd += r.costEstimateUsd;
    }

    return {
      period: activePeriod,
      summary,
      totalCostUsd: Number(Object.values(summary).reduce((acc, curr) => acc + curr.costEstimateUsd, 0).toFixed(4))
    };
  }
}

export const entitlementEngine = new EntitlementEngine();
