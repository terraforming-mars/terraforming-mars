import {expect} from 'chai';
import {TerralabsResearchMarsBot} from '@/server/automa/corps/turmoil/TerralabsResearchMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('TerralabsResearchMarsBot', () => {
  it('setup takes 8 TR off MarsBot', () => {
    const {marsBot, calls} = recordingMarsBot();

    new TerralabsResearchMarsBot().setup(marsBot);

    expect(calls).deep.eq(['raiseTR(-8)']);
  });

  for (const run of [
    {generation: 8, count: 1},
    {generation: 9, count: 2},
  ]) {
    it(`draws ${run.count} card(s) to the action deck in generation ${run.generation}`, () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;

      new TerralabsResearchMarsBot().beforeActionPhase(marsBot);

      expect(calls).deep.eq([`drawProjectCardsToActionDeck(${run.count})`]);
    });
  }
});
