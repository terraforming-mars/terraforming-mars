import {expect} from 'chai';
import {DiversificationMarsBot} from '@/server/automa/bonusCards/DiversificationMarsBot';
import {setAllTracks} from '../FakeMarsBot';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('DiversificationMarsBot', () => {
  for (const run of [
    {megacredits: 6, megacreditsLeft: 2},
    {megacredits: 3, megacreditsLeft: 0},
  ] as const) {
    it('advances the least-advanced track, then loses up to 4 M€: ' + JSON.stringify(run), () => {
      const {marsBot, calls} = recordingMarsBot({megacredits: run.megacredits});
      setAllTracks(marsBot, 4);
      marsBot.marsBotBoard.tracks[TRACK.science].position = 2;

      new DiversificationMarsBot().resolve(marsBot);

      expect(calls).deep.eq([`advanceTrack(${TRACK.science})`]);
      expect(marsBot.megacredits).eq(run.megacreditsLeft);
    });
  }
});
