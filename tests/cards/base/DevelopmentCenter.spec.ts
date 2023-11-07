import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DevelopmentCenter} from '../../../src/server/cards/base/DevelopmentCenter';
import {TestPlayer} from '../../TestPlayer';

describe('DevelopmentCenter', function() {
  let card: DevelopmentCenter;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DevelopmentCenter();
    [/* game */, player] = testGame(2);
  });

  it('Can not act', function() {
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

