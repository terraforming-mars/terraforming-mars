import {expect} from 'chai';
import {maybePlaceGreenery} from '@/server/automa/bonusCards/bonusCardHelpers';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('bonusCardHelpers', () => {
  for (const run of [
    {accepted: ['21'], placed: true},
    {accepted: [], placed: false},
  ] as const) {
    it('places a greenery only on a space the filter accepts: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false});
      const accepted: ReadonlyArray<string> = run.accepted;

      const placed = maybePlaceGreenery(marsBot, (space) => accepted.includes(space.id));

      expect(game.board.getGreeneries(botPlayer).map((space) => space.id)).deep.eq(accepted);
      expect(placed).eq(run.placed);
    });
  }
});
