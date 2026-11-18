// Shared labels for the milestones and awards components.
import {RandomGoalType, Pool, Randomness} from './types';

/** Labels for RANDOM_GOAL_TYPES. */
export const RANDOM_GOAL_TYPE_LABELS: Readonly<Record<RandomGoalType, string>> = {
  board: 'Board',
  random: 'Random',
  manual: 'Manual',
};

/** Labels for POOLS. */
export const POOL_LABELS: Readonly<Record<Pool, string>> = {
  'official': 'Official',
  'maps': 'Maps',
  'maps-fan': 'Maps + Fan maps',
};

/** Labels for RANDOMNESS. */
export const RANDOMNESS_LABELS: Readonly<Record<Randomness, string>> = {
  limited: 'Limited synergy',
  full: 'Full random',
};
