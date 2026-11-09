import {expect} from 'chai';
import {INVENTRIX_MARSBOT_CORP} from '@/server/automa/corps/base/InventrixMarsBot';
import {ArtificialLake} from '@/server/cards/base/ArtificialLake';
import {MagneticFieldGenerators} from '@/server/cards/base/MagneticFieldGenerators';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('InventrixMarsBot', () => {
  // The Setup box (rulebook B p.1). With Venus Next the bonus deck's Lobbyists is B15
  it('removes Lobbyists at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    INVENTRIX_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['removeBonusCard(B06)', 'removeBonusCard(B15)']);
  });

  for (const run of [
    {card: new ArtificialLake(), requirements: 'with', calls: ['gainMc(2)']},
    {card: new MagneticFieldGenerators(), requirements: 'without', calls: []},
  ]) {
    it(`gains 2 M€ for a card with requirements, card ${run.requirements} requirements`, () => {
      const {marsBot, calls} = recordingMarsBot();

      INVENTRIX_MARSBOT_CORP.effect!.onProjectCardResolved!(marsBot, run.card);

      expect(calls).deep.eq(run.calls);
    });
  }
});
