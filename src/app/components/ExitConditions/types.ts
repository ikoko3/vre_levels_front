// components/ExitConditions/types.ts

export interface ExitCondition {
  id: string | number;
  type: string;
  status: string;
  comments: string;
  fulfilled: boolean;
  tooltip_url?: string;
  discussion_url?: string;
}

export interface ExitConditionCardProps {
  cond: ExitCondition;
  labId: string;
  userRoles: string[];
  onUpdateClick?: (cond: ExitCondition) => void;
}
