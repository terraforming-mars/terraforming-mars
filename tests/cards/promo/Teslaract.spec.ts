import {expect} from 'chai';
import {Teslaract} from '@/server/cards/promo/Teslaract';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('Teslaract', () => {
  let card: Teslaract;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Teslaract();
    [/* game */, player] = testGame(2);
  });

  it('play', () => {
    expect(player.terraformRating).to.eq(20);
    cast(card.play(player), undefined);
    expect(player.terraformRating).to.eq(21);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;

    player.production.energy = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.production.energy = 1;

    card.action(player);

    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(1);
  });
});
