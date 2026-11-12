// Conversions between GoalSettings and the game options. Only the create game form uses them.
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {CustomMA} from '@/common/ma/CustomMA';
import {GoalSettings, Pool, RandomGoalType} from './types';

/** The game options behind the milestones and awards settings. */
export type GoalGameOptions = {
  randomMA: RandomMAOptionType;
  modularMA: boolean;
  includeFanMA: boolean;
  customMA: CustomMA | undefined;
};

/**
 * The game options for `goals`.
 *
 * Only the type's own part is used. The board and manual types turn off `modularMA` and `includeFanMA`, because the
 * server still uses them on boards without their own milestones and awards.
 */
export function toGameOptions(goals: GoalSettings): GoalGameOptions {
  switch (goals.type) {
  case 'board':
    return {randomMA: RandomMAOptionType.NONE, modularMA: false, includeFanMA: false, customMA: undefined};
  case 'random':
    return {
      randomMA: goals.random.randomness === 'full' ? RandomMAOptionType.UNLIMITED : RandomMAOptionType.LIMITED,
      modularMA: goals.random.pool === 'official',
      includeFanMA: goals.random.pool === 'maps-fan',
      customMA: undefined,
    };
  case 'manual':
    return {randomMA: RandomMAOptionType.MANUAL, modularMA: false, includeFanMA: false, customMA: goals.selected};
  }
}

const RANDOM_MA_TO_TYPE: Readonly<Record<RandomMAOptionType, RandomGoalType>> = {
  [RandomMAOptionType.NONE]: 'board',
  [RandomMAOptionType.LIMITED]: 'random',
  [RandomMAOptionType.UNLIMITED]: 'random',
  [RandomMAOptionType.MANUAL]: 'manual',
};

/** The settings for the game options. The parts the type doesn't use get their defaults. */
export function fromGameOptions(options: GoalGameOptions): GoalSettings {
  const type = RANDOM_MA_TO_TYPE[options.randomMA];
  const pool: Pool = options.modularMA ? 'official' : options.includeFanMA ? 'maps-fan' : 'maps';
  return {
    type,
    random: type === 'random' ?
      {pool, randomness: options.randomMA === RandomMAOptionType.UNLIMITED ? 'full' : 'limited'} :
      {pool: 'maps', randomness: 'limited'},
    selected: options.customMA ?? {milestones: [], awards: []},
  };
}
