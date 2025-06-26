import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DevelopmentCenter} from '../../../src/server/cards/base/DevelopmentCenter';
import {TestPlayer} from '../../TestPlayer';

describe('DevelopmentCenter', () => {
  let card: DevelopmentCenter;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DevelopmentCenter();
    [/* game */, player] = testGame(2);
  });

  it('Can not act', () => {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});

