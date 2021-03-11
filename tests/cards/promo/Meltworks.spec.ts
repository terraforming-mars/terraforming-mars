import {expect} from 'chai';
import {Meltworks} from '../../../src/cards/promo/Meltworks';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Meltworks', function() {
  let card : Meltworks; let player : Player;

  beforeEach(function() {
    card = new Meltworks();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t act', function() {
    player.heat = 4;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.heat = 5;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.steel).to.eq(3);
  });
});
