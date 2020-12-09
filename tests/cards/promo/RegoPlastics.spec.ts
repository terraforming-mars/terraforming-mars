import {expect} from 'chai';
import {RegoPlastics} from '../../../src/cards/promo/RegoPlastics';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('RegoPlastics', function() {
  let card : RegoPlastics; let player : Player;

  beforeEach(function() {
    card = new RegoPlastics();
    player = TestPlayers.BLUE.newPlayer();
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
