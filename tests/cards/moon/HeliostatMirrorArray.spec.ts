import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {HeliostatMirrorArray} from '../../../src/server/cards/moon/HeliostatMirrorArray';
import {TestPlayer} from '../../TestPlayer';

describe('HeliostatMirrorArray', () => {
  let player: TestPlayer;
  let card: HeliostatMirrorArray;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new HeliostatMirrorArray();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.megacredits = card.cost;

    player.stock.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.stock.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.production.override({energy: 0});
    player.stock.titanium = 1;
    player.stock.heat = 0;

    card.play(player);

    expect(player.stock.titanium).eq(0);
    expect(player.stock.heat).eq(1);
    expect(player.production.energy).eq(2);
  });
});

