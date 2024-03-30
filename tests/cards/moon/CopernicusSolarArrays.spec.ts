import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {CopernicusSolarArrays} from '../../../src/server/cards/moon/CopernicusSolarArrays';

describe('CopernicusSolarArrays', () => {
  let player: TestPlayer;
  let card: CopernicusSolarArrays;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new CopernicusSolarArrays();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.megacredits = card.cost;

    player.stock.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.stock.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.stock.titanium = 1;
    player.stock.heat = 0;

    card.play(player);

    expect(player.stock.titanium).eq(0);
    expect(player.stock.heat).eq(2);
    expect(player.production.energy).eq(1);
  });
});
