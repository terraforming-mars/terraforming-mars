import {expect} from 'chai';
import {RegoPlastics} from '../../../src/cards/promo/RegoPlastics';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('RegoPlastics', function() {
  let card : RegoPlastics; let player : Player;

  beforeEach(function() {
    card = new RegoPlastics();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getSteelValue()).to.eq(3);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
