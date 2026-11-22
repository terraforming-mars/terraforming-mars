import {expect} from 'chai';
import {NirgalEnterprisesMarsBot} from '@/server/automa/corps/prelude2/NirgalEnterprisesMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('NirgalEnterprisesMarsBot', () => {
  it('removes Overachievement at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new NirgalEnterprisesMarsBot().setup(marsBot);

    expect(calls).deep.eq(['removeBonusCard(Overachievement)']);
  });

  it('adds 2 to every award', () => {
    expect(new NirgalEnterprisesMarsBot().awardScoreBonus()).eq(2);
  });

  const milestone = 'maybeClaimMilestone()';
  const award = 'maybeFundAward()';
  for (const run of [
    {generation: 1, expected: []},
    {generation: 2, expected: [milestone]},
    {generation: 5, expected: [milestone]},
    {generation: 6, expected: [award]},
    {generation: 9, expected: [award]},
    {generation: 10, expected: [milestone]},
  ]) {
    it(`claims a milestone in generations 2 to 5 and from 10, and funds an award in 6 to 9, generation ${run.generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;

      new NirgalEnterprisesMarsBot().beforeActionPhase(marsBot);

      expect(calls).deep.eq(run.expected);
    });
  }
});
