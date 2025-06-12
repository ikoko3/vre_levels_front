// src/types/lab/viewModels.ts

export interface ExitConditionViewModel {
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
  assignedAt: string;
}

export interface VirtualLabViewModel {
  name: string;
  alias: string;
  maturityLevel: number;
  maturityReachedAt: string;
  exitConditions: ExitConditionViewModel[];
  assignedUsers: AssignedUserViewModel[];
}
