// Shared types for the milestones and awards components.
import {MilestoneName} from '@/common/ma/MilestoneName';
import {AwardName} from '@/common/ma/AwardName';

/** How the game's milestones and awards are chosen. */
export const RANDOM_GOAL_TYPES = ['board', 'random', 'manual'] as const;
export type RandomGoalType = typeof RANDOM_GOAL_TYPES[number];

/**
 * Where random goals are drawn from.
 *
 * * 'official' is the official modular expansion (`modularMA`).
 * * 'maps' is the goals on the official boards, plus the ones that aren't on any board or in the modular expansion.
 * * 'maps-fan' is 'maps' plus the fan boards' goals.
 */
export const POOLS = ['official', 'maps', 'maps-fan'] as const;
export type Pool = typeof POOLS[number];

/** The randomness when selecting goals. */
export const RANDOMNESS = ['limited', 'full'] as const;
export type Randomness = typeof RANDOMNESS[number];

/** Hand-picked milestones and awards. */
export type SelectedGoals = {
  milestones: ReadonlyArray<MilestoneName>;
  awards: ReadonlyArray<AwardName>;
};

/**
 * The milestones and awards settings, as the create game form and the goals components hold them.
 *
 * Every part is kept whatever the type, so switching to another type and back restores it. Only the create game form
 * converts these to and from the game options.
 */
export type GoalSettings = {
  type: RandomGoalType;
  /** Used when the type is 'random'. */
  random: {pool: Pool, randomness: Randomness};
  /** Used when the type is 'manual'. */
  selected: SelectedGoals;
};
