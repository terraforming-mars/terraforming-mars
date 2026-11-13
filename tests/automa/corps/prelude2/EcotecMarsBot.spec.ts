import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {ECOTEC_MARSBOT_CORP} from '@/server/automa/corps/prelude2/EcotecMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const PLANT = 6;

describe('EcotecMarsBot', () => {
  it('collects plant resources, 2 from setup and 1 for each Plant, Microbe and Animal tag, and spends 5', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();

    ECOTEC_MARSBOT_CORP.setup!(marsBot);
    for (const tag of [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.SPACE]) {
      ECOTEC_MARSBOT_CORP.effect!.onTagResolved!(marsBot, tag);
    }
    ECOTEC_MARSBOT_CORP.beforeActionPhase!(marsBot);

    expect(corpState.get('plantResources')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${PLANT})`]);
  });

  it('has a white cube on every space of the plant track', () => {
    expect(trackCubes(ECOTEC_MARSBOT_CORP)).deep.eq(Array.from({length: 18}, (_, i) => `plant white ${i + 1}`));
  });
});
