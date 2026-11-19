import {expect} from 'chai';
import {HelionMarsBot} from '@/server/automa/corps/base/HelionMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('HelionMarsBot', () => {
  for (const run of [
    {track: TRACK.building, cube: 'white', calls: ['maybeDrawAndResolveProjectCard()']},
    {track: TRACK.earth, cube: 'black', calls: ['raiseTemperature(1)']},
  ] as const) {
    it(`draws a project card for a white cube and raises the temperature for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new HelionMarsBot().onTrackCubeTrigger(marsBot, run.track, 1, run.cube);

      expect(calls).deep.eq(run.calls);
    });
  }

  // The card names the tracks by tag, the cube list names them by index
  it('puts its cubes on the tracks the card names', () => {
    expect(trackCubes(new HelionMarsBot())).to.have.members([
      'building white 6',
      'space white 9',
      'science white 10',
      'power white 5',
      'power white 9',
      'plant white 11',
      ...[3, 6, 9, 12, 13, 14].map((position) => `earth black ${position}`),
    ]);
  });

  // The card replaces the temperature step only
  it('white cube replaces a temperature step, and no other icon', () => {
    const white = (position: number) => new HelionMarsBot().onTrackCubeTrigger(recordingMarsBot().marsBot, TRACK.building, position, 'white');

    expect(white(6)).is.true;
    expect(white(7)).is.false;
  });
});
