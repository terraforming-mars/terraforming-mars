import {expect} from 'chai';
import {InvestorsMarsBot} from '@/server/automa/bonusCards/InvestorsMarsBot';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('InvestorsMarsBot', () => {
  for (const run of [
    {generation: 2, tracks: [5, 3, 1, 4, 4, 6, 2], expected: {after: [5, 3, 2, 4, 4, 5, 2], calls: [`maybeAdvanceTrack(${TRACK.event})`]}},
    // Ties go to the upper track: space over event, building over science
    {generation: 4, tracks: [4, 1, 1, 4, 2, 2, 3], expected: {after: [3, 2, 1, 4, 2, 2, 3], calls: [`maybeAdvanceTrack(${TRACK.space})`]}},
    {generation: 3, tracks: [5, 3, 2, 4, 4, 6, 3], expected: {after: [5, 3, 2, 4, 4, 6, 3], calls: ['gainMc(2)']}},
  ] as const) {
    it('in an even generation moves the least- and most-advanced tracks, otherwise gains M€: ' + JSON.stringify(run), () => {
      const {marsBot, calls} = recordingMarsBot();
      marsBot.game.generation = run.generation;
      marsBot.marsBotBoard.tracks.forEach((track, i) => track.position = run.tracks[i]);

      new InvestorsMarsBot().resolve(marsBot);

      expect(marsBot.marsBotBoard.tracks.map((track) => track.position)).deep.eq(run.expected.after);
      expect(calls).deep.eq(run.expected.calls);
    });
  }
});
