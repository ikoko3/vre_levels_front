// src/types/lab/viewModels.ts

export interface ExitConditionViewModel {
  fulfilled: boolean;
  category: number;
  type: number;
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
