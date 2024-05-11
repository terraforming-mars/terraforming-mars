import {TestPlayer} from '../../TestPlayer';
import {SphereHabitats} from '../../../src/server/cards/moon/SphereHabitats';
import {expect} from 'chai';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';
import {testGame} from '../../TestingUtils';

describe('SphereHabitats', () => {
  let player: TestPlayer;
  let card: SphereHabitats;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new SphereHabitats();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(2);
    // PlaceMoonHabitatTile is what's responsible for raising the habitat rate.
    // Currently that path is already tested with existing code.
    // So I won't keep repeating it.
    // That said, PlaceMoonRoadTile could have its own test. :D
    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonHabitatTile);
  });
});

