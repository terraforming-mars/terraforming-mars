import {expect} from 'chai';
import {SettlersMarsBot} from '@/server/automa/bonusCards/SettlersMarsBot';
import {Mine} from '@/server/cards/base/Mine';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('SettlersMarsBot', () => {
  // Of the empty Tharsis spaces with two bonus icons, only 35 and 36 touch three ocean-reserved spaces
  for (const run of [
    {marked: [], expected: '36'},
    {marked: ['36'], expected: '35'},
  ] as const) {
    it('puts a marker on a free space next to the most ocean-reserved spaces: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const placed: Array<string> = [];
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, placeMarker: (space) => placed.push(space.id)});
      for (const id of run.marked) {
        game.board.getSpaceOrThrow(id).player = botPlayer;
      }
      // Cost 4 counts to the 2nd of 2
      game.projectDeck.drawPile.push(new Mine());

      new SettlersMarsBot().resolve(marsBot);

      expect(placed).deep.eq([run.expected]);
    });
  }

  it('places no marker when every land space has one', () => {
    const [game, human, botPlayer] = testGame(2);
    const placed: Array<string> = [];
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, placeMarker: (space) => placed.push(space.id)});
    for (const space of game.board.getAvailableSpacesOnLand(botPlayer)) {
      space.player = botPlayer;
    }

    new SettlersMarsBot().resolve(marsBot);

    expect(placed).is.empty;
  });
});
