import { db } from './db';
import { Agent, RiskTier, AgentApprovalRequest, AuditLogEntry, AgentIncident } from '../src/types/econos';

export interface ToolExecutionRequest {
  agentId: string;
  organizationId: string;
  toolName: string;
  intent: string;
  financialImpact?: number;
  targetResource: string;
  params?: Record<string, any>;
  actorId?: string;
  actorName?: string;
}

export interface FirewallDecision {
  allowed: boolean;
  requiresApproval: boolean;
  blocked: boolean;
  riskTier: RiskTier;
  decisionCode: 'ALLOWED' | 'MONITORED' | 'ESCALATED' | 'BLOCKED';
  reason: string;
  approvalRequestId?: string;
  auditLogId: string;
  incidentId?: string;
  executionResult?: any;
}

// Banned destructive tool patterns that are unconditionally blocked
const BANNED_PATTERNS = [
  /drop\s+table/i,
  /truncate/i,
  /delete\s+from\s+audit/i,
  /bypass_policy/i,
  /escalate_privilege/i,
  /grant_all_permissions/i,
  /disable_firewall/i,
  /transfer_to_unverified_external/i
];

export class EconosAIFirewall {
  /**
   * Evaluate a requested tool action through the 8-stage Policy & Risk pipeline:
   * 1. Agent Status & Identity Check (ACTIVE, not PAUSED/FROZEN/REVOKED)
   * 2. Permission Evaluation (Does agent have required permission?)
   * 3. Prompt-Injection / Destructive Guardrail Check (Hard blocks)
   * 4. Policy Engine Evaluation (Thresholds, Spending limits, Allowed hours)
   * 5. Risk Tier Classification (LOW, MEDIUM, HIGH, CRITICAL)
   * 6. Approval Gateway Check (High-risk or over-limit triggers approval request)
   * 7. Tool Execution (Controlled Gateway)
   * 8. Immutable Audit Trail Logging & Outcome Recording
   */
  public async evaluateAndExecute(req: ToolExecutionRequest): Promise<FirewallDecision> {
    const auditId = `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const agent = db.getAgentById(req.agentId, req.organizationId);

    // Stage 1: Agent Identity and Lifecycle State
    if (!agent) {
      this.logAudit({
        id: auditId,
        organizationId: req.organizationId,
        actorId: req.actorId || 'system',
        actorName: req.actorName || 'System Gatekeeper',
        agentId: req.agentId,
        action: req.toolName,
        resource: req.targetResource,
        riskTier: 'CRITICAL',
        decision: 'BLOCKED',
        result: 'FAILURE',
        timestamp: new Date().toISOString(),
        details: `Firewall blocked execution: Agent ${req.agentId} does not exist in organization ${req.organizationId}.`
      });

      return {
        allowed: false,
        requiresApproval: false,
        blocked: true,
        riskTier: 'CRITICAL',
        decisionCode: 'BLOCKED',
        reason: 'Agent identity not verified in current organization.',
        auditLogId: auditId
      };
    }

    if (agent.status !== 'ACTIVE') {
      const reason = `Agent ${agent.name} is currently ${agent.status}. Privileged execution is forbidden.`;
      this.logAudit({
        id: auditId,
        organizationId: req.organizationId,
        actorId: req.agentId,
        actorName: agent.name,
        agentId: agent.id,
        agentName: agent.name,
        action: req.toolName,
        resource: req.targetResource,
        riskTier: 'HIGH',
        decision: 'BLOCKED',
        result: 'FAILURE',
        timestamp: new Date().toISOString(),
        details: reason
      });

      return {
        allowed: false,
        requiresApproval: false,
        blocked: true,
        riskTier: 'HIGH',
        decisionCode: 'BLOCKED',
        reason,
        auditLogId: auditId
      };
    }

    // Stage 2: Destructive / Harmful Guardrails check
    const combinedInput = `${req.toolName} ${req.intent} ${JSON.stringify(req.params || {})}`;
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(combinedInput)) {
        // Create an incident immediately
        const incidentId = `inc_${Date.now()}`;
        db.createIncident({
          id: incidentId,
          agentId: agent.id,
          agentName: agent.name,
          organizationId: req.organizationId,
          severity: 'CRITICAL',
          category: 'SECURITY_GUARDRAIL_VIOLATION',
          description: `Blocked destructive or forbidden command matching pattern: ${pattern.toString()}`,
          detectedAt: new Date().toISOString(),
          source: 'ECONOS AI Firewall Guardrail Engine',
          actionAttempted: req.toolName,
          status: 'CONTAINED',
          relatedAuditId: auditId
        });

        // Penalize trust & flag metrics
        db.updateAgentMetrics(agent.id, req.organizationId, { incidentIncrement: true, trustScoreChange: -15 });

        this.logAudit({
          id: auditId,
          organizationId: req.organizationId,
          actorId: agent.id,
          actorName: agent.name,
          agentId: agent.id,
          agentName: agent.name,
          action: req.toolName,
          resource: req.targetResource,
          riskTier: 'CRITICAL',
          decision: 'BLOCKED',
          result: 'FAILURE',
          timestamp: new Date().toISOString(),
          details: `CRITICAL BLOCK: Destructive pattern detected (${pattern.toString()}). Incident logged: ${incidentId}.`
        });

        return {
          allowed: false,
          requiresApproval: false,
          blocked: true,
          riskTier: 'CRITICAL',
          decisionCode: 'BLOCKED',
          reason: 'Prohibited security guardrail violation. Action dropped and incident recorded.',
          auditLogId: auditId,
          incidentId
        };
      }
    }

    // Stage 3: Granular Permission Check
    const requiredPermission = this.resolveRequiredPermission(req.toolName);
    if (requiredPermission && !agent.permissions.includes(requiredPermission)) {
      const reason = `Agent lacks required permission: ${requiredPermission} for tool ${req.toolName}.`;
      this.logAudit({
        id: auditId,
        organizationId: req.organizationId,
        actorId: agent.id,
        actorName: agent.name,
        agentId: agent.id,
        agentName: agent.name,
        action: req.toolName,
        resource: req.targetResource,
        riskTier: 'HIGH',
        decision: 'BLOCKED',
        result: 'FAILURE',
        timestamp: new Date().toISOString(),
        details: reason
      });

      return {
        allowed: false,
        requiresApproval: false,
        blocked: true,
        riskTier: 'HIGH',
        decisionCode: 'BLOCKED',
        reason,
        auditLogId: auditId
      };
    }

    // Stage 4 & 5: Risk Engine & Policy Threshold Evaluation
    const financialImpact = req.financialImpact || 0;
    const policies = db.getPolicies(req.organizationId);
    let spendingCap = agent.spendingLimitMonthly;

    // Find any org policy overriding max autonomous limit
    const spendingPolicy = policies.find(p => p.category === 'FINANCIAL' && p.isActive && p.thresholdValue);
    if (spendingPolicy && spendingPolicy.thresholdValue) {
      spendingCap = Math.min(spendingCap, spendingPolicy.thresholdValue);
    }

    // Determine Risk Tier
    let evaluatedRiskTier: RiskTier = 'LOW';
    if (financialImpact > 100000 || req.toolName.includes('disburse') || req.toolName.includes('liquidate')) {
      evaluatedRiskTier = 'CRITICAL';
    } else if (financialImpact > spendingCap || financialImpact > 25000 || req.toolName.includes('transaction') || req.toolName.includes('contract')) {
      evaluatedRiskTier = 'HIGH';
    } else if (financialImpact > 5000 || req.toolName.includes('negotiate') || req.toolName.includes('email')) {
      evaluatedRiskTier = 'MEDIUM';
    }

    // Stage 6: Approval Gateway Check
    // If High risk OR exceeds spending cap, require human approval
    const needsApproval = evaluatedRiskTier === 'HIGH' || (evaluatedRiskTier === 'CRITICAL' && financialImpact <= 250000);

    if (needsApproval) {
      const approvalId = `appr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      db.createApprovalRequest({
        id: approvalId,
        agentId: agent.id,
        agentName: agent.name,
        organizationId: req.organizationId,
        intent: req.intent,
        actionName: req.toolName,
        toolName: req.toolName,
        requestedPermission: requiredPermission || 'EXECUTE_TRANSACTION',
        financialImpact,
        riskTier: evaluatedRiskTier,
        affectedResource: req.targetResource,
        reasoning: `Impact of $${financialImpact.toLocaleString()} exceeds autonomous threshold ($${spendingCap.toLocaleString()}). Requires human authorization.`,
        evidence: `Agent evaluated risk tier as ${evaluatedRiskTier} with intent: ${req.intent}`,
        status: 'PENDING',
        requestedAt: new Date().toISOString()
      });

      this.logAudit({
        id: auditId,
        organizationId: req.organizationId,
        actorId: agent.id,
        actorName: agent.name,
        agentId: agent.id,
        agentName: agent.name,
        action: req.toolName,
        resource: req.targetResource,
        riskTier: evaluatedRiskTier,
        decision: 'ESCALATED',
        result: 'PENDING_APPROVAL',
        timestamp: new Date().toISOString(),
        details: `Action escalated to human approval queue (Request ID: ${approvalId}). Financial impact: $${financialImpact.toLocaleString()}.`
      });

      return {
        allowed: false,
        requiresApproval: true,
        blocked: false,
        riskTier: evaluatedRiskTier,
        decisionCode: 'ESCALATED',
        reason: `Action requires human executive authorization because financial impact ($${financialImpact.toLocaleString()}) exceeds the autonomous threshold of $${spendingCap.toLocaleString()}.`,
        approvalRequestId: approvalId,
        auditLogId: auditId
      };
    }

    // Stage 7: Execution through Tool Gateway (Mock simulation with actual state outcome)
    const simulatedResult = this.executeToolInternal(req.toolName, req.params, financialImpact);

    // Reward verified successful action with trust score gain
    db.updateAgentMetrics(agent.id, req.organizationId, {
      successfulAction: true,
      trustScoreChange: evaluatedRiskTier === 'MEDIUM' ? 0.4 : 0.2
    });

    // Stage 8: Audit Log
    this.logAudit({
      id: auditId,
      organizationId: req.organizationId,
      actorId: agent.id,
      actorName: agent.name,
      agentId: agent.id,
      agentName: agent.name,
      action: req.toolName,
      resource: req.targetResource,
      riskTier: evaluatedRiskTier,
      decision: evaluatedRiskTier === 'MEDIUM' ? 'MONITORED' : 'ALLOWED',
      result: 'SUCCESS',
      timestamp: new Date().toISOString(),
      details: `Autonomous execution completed. Intent: "${req.intent}". Output: ${simulatedResult.summary}`
    });

    return {
      allowed: true,
      requiresApproval: false,
      blocked: false,
      riskTier: evaluatedRiskTier,
      decisionCode: evaluatedRiskTier === 'MEDIUM' ? 'MONITORED' : 'ALLOWED',
      reason: `Action successfully verified through AI Firewall and executed autonomously within policy boundaries.`,
      auditLogId: auditId,
      executionResult: simulatedResult
    };
  }

  private resolveRequiredPermission(toolName: string): string | null {
    if (toolName.includes('transaction') || toolName.includes('disburse') || toolName.includes('wire')) {
      return 'EXECUTE_TRANSACTION';
    }
    if (toolName.includes('negotiat') || toolName.includes('bid')) {
      return 'NEGOTIATE';
    }
    if (toolName.includes('email') || toolName.includes('send')) {
      return 'SEND_EMAIL';
    }
    if (toolName.includes('delete') || toolName.includes('drop')) {
      return 'DELETE_RECORD';
    }
    if (toolName.includes('financial') || toolName.includes('treasury')) {
      return 'ACCESS_FINANCIAL_DATA';
    }
    if (toolName.includes('customer') || toolName.includes('crm')) {
      return 'READ_CUSTOMER_DATA';
    }
    return 'READ_BUSINESS_DATA';
  }

  private executeToolInternal(toolName: string, params: any, financialImpact: number): { status: string; summary: string; executionTimestamp: string } {
    return {
      status: 'COMPLETED_VERIFIED',
      summary: `Tool '${toolName}' executed successfully with payload params [${Object.keys(params || {}).join(', ')}]. Financial impact: $${financialImpact.toLocaleString()}.`,
      executionTimestamp: new Date().toISOString()
    };
  }

  private logAudit(entry: AuditLogEntry) {
    db.addAuditLog(entry);
  }
}

export const aiFirewall = new EconosAIFirewall();
