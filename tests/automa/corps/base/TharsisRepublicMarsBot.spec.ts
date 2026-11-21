import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {TharsisRepublicMarsBot} from '@/server/automa/corps/base/TharsisRepublicMarsBot';
import {TRACK, recordingMarsBot} from '../RecordingMarsBot';

describe('TharsisRepublicMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('places a city at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new TharsisRepublicMarsBot().setup(marsBot);

    expect(calls).deep.eq(['placeCity()']);
  });

  for (const run of [
    {tileType: TileType.CITY, byMarsBot: true, tile: 'MarsBot city', expected: [`advanceTrack(${TRACK.event})`]},
    {tileType: TileType.CITY, byMarsBot: false, tile: 'player city', expected: ['gainMc(2)']},
    {tileType: TileType.CAPITAL, byMarsBot: false, tile: 'player capital', expected: ['gainMc(2)']},
    {tileType: TileType.GREENERY, byMarsBot: false, tile: 'player greenery', expected: []},
  ]) {
    it(`advances the event track for its own city and gains 2 M€ for a city of the player, ${run.tile}`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new TharsisRepublicMarsBot().onTilePlaced(marsBot, run.byMarsBot, run.tileType);

      expect(calls).deep.eq(run.expected);
    });
  }
});
