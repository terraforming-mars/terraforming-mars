import {expect} from 'chai';
import {Diversification} from '@/server/automa/bonusCards/Diversification';
import {setAllTracks} from '../FakeMarsBot';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('Diversification', () => {
  it('advances the least-advanced track, then loses up to 4 M€', () => {
    const {marsBot, calls} = recordingMarsBot();
    setAllTracks(marsBot, 4);
    marsBot.marsBotBoard.tracks[TRACK.science].position = 2;

    new Diversification().resolve(marsBot);

    expect(calls).deep.eq([`maybeAdvanceTrack(${TRACK.science})`, 'loseMc(4)']);
  });
});
