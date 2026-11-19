import {expect} from 'chai';
import {PoseidonMarsBot} from '@/server/automa/corps/colonies/PoseidonMarsBot';
import {setAllTracks} from '../../FakeMarsBot';
import {TRACK, recordingMarsBot} from '../RecordingMarsBot';

describe('PoseidonMarsBot', () => {
  it('places a colony at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new PoseidonMarsBot().setup(marsBot);

    expect(calls).deep.eq(['maybePlaceRandomColony()']);
  });

  it('advances the least-advanced track for each colony either player builds', () => {
    const {marsBot, calls} = recordingMarsBot();
    setAllTracks(marsBot, 4);
    marsBot.marsBotBoard.tracks[TRACK.power].position = 2;

    new PoseidonMarsBot().onColonyPlaced(marsBot);

    expect(calls).deep.eq([`advanceTrack(${TRACK.power})`]);
  });
});
