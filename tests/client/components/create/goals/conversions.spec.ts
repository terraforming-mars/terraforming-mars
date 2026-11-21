import {expect} from 'chai';
import {fromGameOptions, toGameOptions} from '@/client/components/create/goals/conversions';
import {GoalSettings} from '@/client/components/create/goals/types';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';

const SELECTED = {milestones: ['Terraformer'], awards: ['Banker']} as const;
const GOALS: GoalSettings = {type: 'board', random: {pool: 'maps', randomness: 'limited'}, selected: SELECTED};

describe('conversions', () => {
  for (const run of [
    {idx: 0, goals: {...GOALS, type: 'board'}, options: {randomMA: RandomMAOptionType.NONE, modularMA: false, includeFanMA: false, customMA: undefined}},
    {idx: 1, goals: {...GOALS, type: 'random', random: {pool: 'official', randomness: 'limited'}}, options: {randomMA: RandomMAOptionType.LIMITED, modularMA: true, includeFanMA: false, customMA: undefined}},
    {idx: 2, goals: {...GOALS, type: 'random', random: {pool: 'maps', randomness: 'full'}}, options: {randomMA: RandomMAOptionType.UNLIMITED, modularMA: false, includeFanMA: false, customMA: undefined}},
    {idx: 3, goals: {...GOALS, type: 'random', random: {pool: 'maps-fan', randomness: 'limited'}}, options: {randomMA: RandomMAOptionType.LIMITED, modularMA: false, includeFanMA: true, customMA: undefined}},
    {idx: 4, goals: {...GOALS, type: 'manual'}, options: {randomMA: RandomMAOptionType.MANUAL, modularMA: false, includeFanMA: false, customMA: SELECTED}},
  ] as const) {
    it('fromGameOptions ' + run.idx, () => {
      expect(toGameOptions(run.goals)).deep.eq(run.options);
      expect(toGameOptions(fromGameOptions(run.options))).deep.eq(run.options);
    });
  }

  it('uses only the part the type owns', () => {
    const goals: GoalSettings = {type: 'board', random: {pool: 'official', randomness: 'full'}, selected: SELECTED};
    expect(toGameOptions(goals)).deep.eq({randomMA: RandomMAOptionType.NONE, modularMA: false, includeFanMA: false, customMA: undefined});
  });
});
