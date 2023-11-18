import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {GeodesicTents} from '../../../src/server/cards/moon/GeodesicTents';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';

describe('GeodesicTents', () => {
  let player: TestPlayer;
  let card: GeodesicTents;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new GeodesicTents();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    player.production.override({energy: 0});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.production.override({energy: 1});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.energy).eq(0);
    expect(player.production.plants).eq(1);

    expect(player.game.deferredActions.peek()!).is.instanceOf(PlaceMoonHabitatTile);
  });
});

