import {expect} from 'chai';
import {StanfordTorus} from '../../../src/cards/promo/StanfordTorus';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('StanfordTorus', function() {
  let card : StanfordTorus; let player : Player; let game : Game;

  beforeEach(function() {
    card = new StanfordTorus();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.getCitiesInPlay()).to.eq(1);
  });

  it('Should give victory points', function() {
    card.play(player, game);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
