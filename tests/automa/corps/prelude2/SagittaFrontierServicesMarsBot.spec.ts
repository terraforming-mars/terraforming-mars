import {expect} from 'chai';
import {SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP} from '@/server/automa/corps/prelude2/SagittaFrontierServicesMarsBot';
import {ArtificialLake} from '@/server/cards/base/ArtificialLake';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {MicroMills} from '@/server/cards/base/MicroMills';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('SagittaFrontierServicesMarsBot', () => {
  it('gains 8 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['gainMc(8)']);
  });

  // A tagless card pays the Failed Action amount again, and an event counts its Event tag
  it('pays more M€ for a card with no tags than for one tag, and nothing for two', () => {
    const paid = [new MicroMills(), new ArtificialLake(), new Asteroid()].map((card) => {
      const {marsBot, calls} = recordingMarsBot({failedActionMc: 5});
      SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP.effect!.onProjectCardResolved!(marsBot, card);
      return calls;
    });

    expect(paid).deep.eq([['gainMc(5)'], ['gainMc(1)'], []]);
  });
});
