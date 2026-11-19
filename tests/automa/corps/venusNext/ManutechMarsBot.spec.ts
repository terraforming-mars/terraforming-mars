import {expect} from 'chai';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {ManutechMarsBot} from '@/server/automa/corps/venusNext/ManutechMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('ManutechMarsBot', () => {
  it('advances a track once more after #5 and #12 but not after another space', () => {
    const {marsBot, calls} = recordingMarsBot();

    for (const position of [5, 6, 12]) {
      new ManutechMarsBot().afterTrackSpaceResolved(marsBot, TRACK.event, position);
    }

    expect(calls).deep.eq([`advanceTrack(${TRACK.event})`, `advanceTrack(${TRACK.event})`]);
  });

  it('puts a black cube on #5 and #12 of every track, Venus included', () => {
    expect(trackCubes(new ManutechMarsBot(), [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK])).to.have.members(
      ['building', 'space', 'event', 'science', 'power', 'earth', 'plant', 'venus'].flatMap((tag) => [`${tag} black 5`, `${tag} black 12`]),
    );
  });
});
