import {expect} from 'chai';
import {DevelopmentCenter} from '../../../src/cards/base/DevelopmentCenter';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('DevelopmentCenter', function() {
  let card : DevelopmentCenter; let player : Player;

  beforeEach(function() {
    card = new DevelopmentCenter();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t act', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});

