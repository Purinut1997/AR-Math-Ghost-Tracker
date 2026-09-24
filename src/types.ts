export type GradeLevel = 'ป.1' | 'ป.2' | 'ป.3' | 'ป.4' | 'ป.5' | 'ป.6';

export interface GhostEncounter {
  id: string;
  ghost_type: string;
  ghost_emoji: string;
  narrative: string;
  math_question: string;
  correct_answer: number;
  choices: number[];
  explanation_steps?: string[];
  imageSnapshot?: string;
  timestamp: number;
  gradeLevel: GradeLevel;
  exorcised?: boolean;
}

export interface PlayerStats {
  ghostsExorcised: number;
  score: number;
  streak: number;
  bestStreak: number;
  totalAttempts: number;
  rank: string;
  level: number;
  exp: number;
  expToNextLevel: number;
}

export type VisionFilter = 'clear' | 'horror' | 'night' | 'spectral' | 'shadow';

export type ItemType = 'talisman' | 'hourglass' | 'uv_light' | 'holy_water' | 'salt_barrier';

export interface InventoryItem {
  id: ItemType;
  name: string;
  emoji: string;
  description: string;
  count: number;
  cost: number;
}

export interface PlayerInventory {
  talisman: number; // Discard 2 wrong choices
  hourglass: number; // Add 30 seconds
  uv_light: number; // Reveal ghost hint
  holy_water: number; // 2x Exp and Score on exorcism
  salt_barrier: number; // Streak protection shield + remove 1 wrong choice
}

export interface DailyBounty {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  current: number;
  rewardExp: number;
  rewardScore: number;
  rewardItem?: ItemType;
  claimed: boolean;
}
