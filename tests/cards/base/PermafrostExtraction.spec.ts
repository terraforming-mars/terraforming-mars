import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/cards/base/PermafrostExtraction';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('PermafrostExtraction', function() {
  let card : PermafrostExtraction; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PermafrostExtraction();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -8;
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
        action!.cb(action!.availableSpaces[0]);
        expect(game.board.getOceansOnBoard()).to.eq(1);
  });
});
