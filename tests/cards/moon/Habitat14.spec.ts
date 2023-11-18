import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Habitat14} from '../../../src/server/cards/moon/Habitat14';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';

describe('Habitat14', () => {
  let player: TestPlayer;
  let card: Habitat14;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new Habitat14();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    player.production.override({megacredits: -4, energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    player.production.override({megacredits: -5, energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    player.production.override({megacredits: -4, energy: 0});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    player.production.override({megacredits: -4, energy: 1});
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.production.override({megacredits: 1, energy: 1});
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(0);
    expect(player.production.energy).eq(0);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonHabitatTile);
  });
});

