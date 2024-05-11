import {TestPlayer} from '../../TestPlayer';
import {TheWomb} from '../../../src/server/cards/moon/TheWomb';
import {expect} from 'chai';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';
import {testGame} from '../../TestingUtils';

describe('TheWomb', () => {
  let player: TestPlayer;
  let card: TheWomb;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new TheWomb();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    player.production.override({energy: 2});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 2;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 2;
    player.production.override({energy: 2});
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.production.override({energy: 2});
    player.titanium = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(4);
    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonHabitatTile);
  });
});

