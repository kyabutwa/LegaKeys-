export type UUID = string;

export type WorkspaceType = "LEGAKEYS_OPERATING" | "COMMUNITY_OPERATING" | "SERVICE_OPERATING" | "TEAM" | "PERSONAL" | "INCIDENT" | "PROJECT" | "REVIEW";
export type WorkspaceLifecycle = "PROPOSED" | "CONFIGURING" | "ACTIVE" | "DEGRADED" | "SUSPENDED" | "ARCHIVED";
export type WorkspaceRole = "ADMINISTRATOR" | "OPERATOR" | "REVIEWER" | "CONTRIBUTOR" | "ANALYST" | "VIEWER";
export type MembershipStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
export type WorkItemType = "TASK" | "REQUEST" | "CASE" | "PROPOSAL" | "REVIEW" | "INCIDENT" | "OPERATION";
export type WorkspaceViewType = "PERSONAL" | "ROLE" | "TEAM" | "COMMUNITY" | "SERVICE" | "INCIDENT" | "PROJECT" | "SYSTEM";

export interface Workspace {
  id: UUID;
  type: WorkspaceType;
  name: string;
  purpose: string;
  scopeRef: UUID;
  lifecycle: WorkspaceLifecycle;
  governanceRef: UUID;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMembership {
  id: UUID;
  workspaceId: UUID;
  participantRef: UUID;
  role: WorkspaceRole;
  status: MembershipStatus;
  scopeRef: UUID;
  validFrom: string;
  validUntil?: string;
  basisRef?: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceCapability {
  id: UUID;
  workspaceId: UUID;
  capabilityRef: UUID;
  role: WorkspaceRole;
  scopeRef: UUID;
  policyRef: UUID;
  enabled: boolean;
}

export interface WorkspaceDelegation {
  id: UUID;
  workspaceId: UUID;
  delegatorParticipantRef: UUID;
  delegateeParticipantRef: UUID;
  capabilityRef: UUID;
  scopeRef: UUID;
  validFrom: string;
  validUntil: string;
  conditions: Record<string, unknown>;
  authorityRef: UUID;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
}

export interface WorkspaceWorkItem {
  id: UUID;
  workspaceId: UUID;
  type: WorkItemType;
  title: string;
  subjectRef?: UUID;
  contextRef?: UUID;
  proposalRef?: UUID;
  authorizationRef?: UUID;
  status: string;
  createdByParticipantRef: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceRuntime {
  createWorkspace(input: Omit<Workspace, "createdAt" | "updatedAt">): Promise<Workspace>;
  addMembership(input: WorkspaceMembership): Promise<WorkspaceMembership>;
  revokeMembership(workspaceId: UUID, membershipId: UUID): Promise<void>;
  assignRole(membershipId: UUID, role: WorkspaceRole): Promise<WorkspaceMembership>;
  configureCapability(input: WorkspaceCapability): Promise<WorkspaceCapability>;
  createWorkItem(input: WorkspaceWorkItem): Promise<WorkspaceWorkItem>;
  delegate(input: WorkspaceDelegation): Promise<WorkspaceDelegation>;
  evaluateWorkspaceAccess(workspaceId: UUID, participantRef: UUID, capabilityRef: UUID, scopeRef: UUID): Promise<{ allowed: boolean; reason: string }>;
}
