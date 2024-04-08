import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {ColonistShuttles} from '../../../src/server/cards/moon/ColonistShuttles';

describe('ColonistShuttles', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: ColonistShuttles;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new ColonistShuttles();
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
    MoonExpansion.addHabitatTile(player, 'm02');
    MoonExpansion.addHabitatTile(player, 'm03');
    MoonExpansion.addHabitatTile(player, 'm04');
    MoonExpansion.addHabitatTile(player, 'm05');
    MoonExpansion.addHabitatTile(player, 'm06');
    MoonExpansion.addHabitatTile(player, 'm07');
    MoonExpansion.addHabitatTile(player, 'm08');

    player.titanium = 1;
    player.megaCredits = 0;

    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(1);
    expect(player.megaCredits).eq(14);
  });
});

