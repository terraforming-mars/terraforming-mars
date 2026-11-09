import {expect} from 'chai';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {MANUTECH_MARSBOT_CORP} from '@/server/automa/corps/venusNext/ManutechMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const EVENT = 2;

describe('ManutechMarsBot', () => {
  it('advances a track once more after #5 and #12 but not after another space', () => {
    const {marsBot, calls} = recordingMarsBot();

    for (const position of [5, 6, 12]) {
      MANUTECH_MARSBOT_CORP.effect!.afterTrackSpaceResolved!(marsBot, EVENT, position);
    }

    expect(calls).deep.eq([`advanceTrack(${EVENT})`, `advanceTrack(${EVENT})`]);
  });

  it('puts a black cube on #5 and #12 of every track, Venus included', () => {
    expect(trackCubes(MANUTECH_MARSBOT_CORP, [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK])).to.have.members(
      ['building', 'space', 'event', 'science', 'power', 'earth', 'plant', 'venus'].flatMap((tag) => [`${tag} black 5`, `${tag} black 12`]),
    );
  });
});
