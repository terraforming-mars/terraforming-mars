import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {EcotecMarsBot} from '@/server/automa/corps/prelude2/EcotecMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('EcotecMarsBot', () => {
  it('collects plant resources, 2 from setup and 1 for each Plant, Microbe and Animal tag, and spends 5', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();

    new EcotecMarsBot().setup(marsBot);
    for (const tag of [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.SPACE]) {
      new EcotecMarsBot().onTagResolved(marsBot, tag);
    }
    new EcotecMarsBot().beforeActionPhase(marsBot);

    expect(corpState.get('plantResources')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${TRACK.plant})`]);
  });

  it('has a white cube on every space of the plant track', () => {
    expect(trackCubes(new EcotecMarsBot())).deep.eq(Array.from({length: 18}, (_, i) => `plant white ${i + 1}`));
  });
});
