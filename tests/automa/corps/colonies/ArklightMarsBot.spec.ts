import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {ArklightMarsBot} from '@/server/automa/corps/colonies/ArklightMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('ArklightMarsBot', () => {
  for (const run of [
    {tag: Tag.PLANT, calls: ['gainMc(2)']},
    {tag: Tag.ANIMAL, calls: ['gainMc(2)']},
    {tag: Tag.MICROBE, calls: []},
  ] as const) {
    it('gains 2 M€ for each Plant or Animal tag: ' + JSON.stringify(run), () => {
      const {marsBot, calls} = recordingMarsBot();

      new ArklightMarsBot().onTagResolved(marsBot, run.tag);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('has a white cube on every space of the plant track', () => {
    expect(trackCubes(new ArklightMarsBot())).deep.eq(Array.from({length: 18}, (_, i) => `plant white ${i + 1}`));
  });
});
