import {expect} from 'chai';
import {TERRALABS_RESEARCH_MARSBOT_CORP} from '@/server/automa/corps/turmoil/TerralabsResearchMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

// C38
describe('TerralabsResearchMarsBot', () => {
  it('setup takes 8 TR off MarsBot', () => {
    const {marsBot, calls} = recordingMarsBot();

    TERRALABS_RESEARCH_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['raiseTR(-8)']);
  });

  for (const run of [
    {generation: 8, count: 1},
    {generation: 9, count: 2},
  ]) {
    it(`draws ${run.count} card(s) to the action deck in generation ${run.generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;

      TERRALABS_RESEARCH_MARSBOT_CORP.beforeActionPhase!(marsBot);

      expect(calls).deep.eq([`drawProjectCardsToActionDeck(${run.count})`]);
    });
  }
});
