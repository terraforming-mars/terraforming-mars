import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ArchimedesHydroponicsStation} from '../../../src/server/cards/moon/ArchimedesHydroponicsStation';
import {TestPlayer} from '../../TestPlayer';

describe('ArchimedesHydroponicsStation', () => {
  let player: TestPlayer;
  let card: ArchimedesHydroponicsStation;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new ArchimedesHydroponicsStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({energy: 1, megacredits: -4});
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.production.override({energy: 0, megacredits: -4});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.production.override({energy: 1, megacredits: -5});
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({energy: 1, megacredits: 1, plants: 0});

    card.play(player);

    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(0);
    expect(player.production.plants).eq(2);
  });
});
