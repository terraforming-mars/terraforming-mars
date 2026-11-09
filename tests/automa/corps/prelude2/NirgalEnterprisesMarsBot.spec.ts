import {expect} from 'chai';
import {NIRGAL_ENTERPRISES_MARSBOT_CORP} from '@/server/automa/corps/prelude2/NirgalEnterprisesMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('NirgalEnterprisesMarsBot', () => {
  it('removes Overachievement at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    NIRGAL_ENTERPRISES_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['removeBonusCard(B04)']);
  });

  it('adds 2 to every award', () => {
    expect(NIRGAL_ENTERPRISES_MARSBOT_CORP.effect!.awardScoreBonus!(recordingMarsBot().marsBot)).eq(2);
  });

  const milestone = 'maybeClaimMilestone()';
  const award = 'maybeFundAward()';
  for (const [generation, expected] of [[1, []], [2, [milestone]], [5, [milestone]], [6, [award]], [9, [award]], [10, [milestone]]] as const) {
    it(`claims a milestone in generations 2 to 5 and from 10, and funds an award in 6 to 9, generation ${generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = generation;

      NIRGAL_ENTERPRISES_MARSBOT_CORP.beforeActionPhase!(marsBot);

      expect(calls).deep.eq(expected);
    });
  }
});
