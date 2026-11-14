import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {THARSIS_REPUBLIC_MARSBOT_CORP} from '@/server/automa/corps/base/TharsisRepublicMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

// Track index on the Tharsis board
const EVENT = 2;

describe('TharsisRepublicMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('places a city at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    THARSIS_REPUBLIC_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['placeCity()']);
  });

  for (const run of [
    {tileType: TileType.CITY, byMarsBot: true, tile: 'MarsBot city', calls: [`advanceTrack(${EVENT})`]},
    {tileType: TileType.CITY, byMarsBot: false, tile: 'player city', calls: ['gainMc(2)']},
    {tileType: TileType.CAPITAL, byMarsBot: false, tile: 'player capital', calls: ['gainMc(2)']},
    {tileType: TileType.GREENERY, byMarsBot: false, tile: 'player greenery', calls: []},
  ]) {
    it(`advances the event track for its own city and gains 2 M€ for a city of the player, ${run.tile}`, () => {
      const {marsBot, calls} = recordingMarsBot();

      THARSIS_REPUBLIC_MARSBOT_CORP.effect!.onTilePlaced!(marsBot, run.byMarsBot, run.tileType, marsBot.game.board.spaces[0]);

      expect(calls).deep.eq(run.calls);
    });
  }
});
