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
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.production.override({energy: 0});
    player.titanium = 1;
    player.heat = 0;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.heat).eq(1);
    expect(player.production.energy).eq(2);
  });
});

