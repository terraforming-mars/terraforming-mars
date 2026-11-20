import {expect} from 'chai';
import {KuiperCooperativeMarsBot} from '@/server/automa/corps/promo/KuiperCooperativeMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('KuiperCooperativeMarsBot', () => {
  for (const run of [
    {cube: 'white', expected: ['raiseTemperature(1)']},
    {cube: 'black', expected: ['placeOcean()']},
  ] as const) {
    it(`raises the temperature for a white cube and places an ocean for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new KuiperCooperativeMarsBot().onTrackCubeTrigger(marsBot, TRACK.space, 4, run.cube);

      expect(calls).deep.eq(run.expected);
    });
  }

  it('puts its cubes on the space track', () => {
    expect(trackCubes(new KuiperCooperativeMarsBot())).to.have.members([
      ...[4, 8, 12].map((position) => `space white ${position}`),
      ...[7, 10, 14].map((position) => `space black ${position}`),
    ]);
  });
});
