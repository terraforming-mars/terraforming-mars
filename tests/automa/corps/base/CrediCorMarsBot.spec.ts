import {expect} from 'chai';
import {CREDICOR_MARSBOT_CORP} from '@/server/automa/corps/base/CrediCorMarsBot';
import {ArtificialLake} from '@/server/cards/base/ArtificialLake';
import {MagneticFieldGenerators} from '@/server/cards/base/MagneticFieldGenerators';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('CrediCorMarsBot', () => {
  for (const run of [
    {card: new MagneticFieldGenerators(), cost: 20, calls: ['gainMc(4)']},
    {card: new ArtificialLake(), cost: 15, calls: []},
  ]) {
    it(`gains 4 M€ for a card that costs 20 or more, card that costs ${run.cost}`, () => {
      const {marsBot, calls} = recordingMarsBot();

      CREDICOR_MARSBOT_CORP.effect!.onProjectCardResolved!(marsBot, run.card);

      expect(calls).deep.eq(run.calls);
    });
  }
});
