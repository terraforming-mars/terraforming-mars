import {expect} from 'chai';
import {ArcticAlgae} from '../../../src/cards/base/ArcticAlgae';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('ArcticAlgae', function() {
  let card : ArcticAlgae; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new ArcticAlgae();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play', function() {
    (game as any).temperature = -10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.plants).to.eq(1);
    player.playedCards.push(card);

    game.addOceanTile(player2, game.board.getAvailableSpacesForOcean(player2)[0].id);
    TestingUtils.runNextAction(game);
    expect(player.plants).to.eq(3);
  });
});
