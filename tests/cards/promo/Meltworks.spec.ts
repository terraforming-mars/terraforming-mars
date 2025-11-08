import {expect} from 'chai';
import {Meltworks} from '../../../src/server/cards/promo/Meltworks';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Meltworks', () => {
  let card: Meltworks;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Meltworks();
    [/* game */, player] = testGame(1);
  });

  it('Can not act', () => {
    player.heat = 4;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.heat = 5;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.steel).to.eq(3);
  });
});
