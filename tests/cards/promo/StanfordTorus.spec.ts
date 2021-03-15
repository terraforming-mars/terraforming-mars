import {expect} from 'chai';
import {StanfordTorus} from '../../../src/cards/promo/StanfordTorus';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('StanfordTorus', function() {
  let card : StanfordTorus; let player : Player;

  beforeEach(function() {
    card = new StanfordTorus();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.game.getCitiesInPlay()).to.eq(1);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
