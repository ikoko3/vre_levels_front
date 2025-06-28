// src/types/lab/viewModels.ts

export interface ExitConditionViewModel {
  id: string;
  fulfilled: boolean;
  category: number;
  type: number;
  status: number;
  discussion_url: string;
  tooltip_url?: string;
}

export interface AssignedUserViewModel {
  userId: string;
  roleCode: string;
  role: string;
  assignedAt: string;
  description: string;
}

export interface VirtualLabViewModel {
  id: string;
  name: string;
  alias: string;
  maturityLevel: number;
  maturityReachedAt: string;
  exitConditions: ExitConditionViewModel[];
  assignedUsers: AssignedUserViewModel[];
}
