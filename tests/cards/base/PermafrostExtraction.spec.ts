import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/cards/base/PermafrostExtraction';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestingUtils} from '../../TestingUtils';

describe('PermafrostExtraction', function() {
  let card : PermafrostExtraction; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PermafrostExtraction();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -8;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    TestingUtils.runAllActions(game);
    const selectSpace = TestingUtils.cast(player.getWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(game.board.getOceanCount()).to.eq(1);
  });
});
