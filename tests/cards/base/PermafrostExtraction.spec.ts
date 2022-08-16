import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/server/cards/base/PermafrostExtraction';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {runAllActions, cast} from '../../TestingUtils';

describe('PermafrostExtraction', function() {
  let card: PermafrostExtraction;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new PermafrostExtraction();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -8;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(game.board.getOceanCount()).to.eq(1);
  });
});
