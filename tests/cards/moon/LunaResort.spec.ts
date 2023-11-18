import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {LunaResort} from '../../../src/server/cards/moon/LunaResort';
import {TileType} from '../../../src/common/TileType';

describe('LunaResort', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: LunaResort;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new LunaResort();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    spaces[1].tile = {tileType: TileType.MOON_HABITAT};
    player.titanium = 2;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.include(card);

    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    spaces[1].tile = {tileType: TileType.MOON_HABITAT};
    player.titanium = 1;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    spaces[1].tile = {tileType: TileType.MOON_HABITAT};
    player.titanium = 2;
    player.production.override({energy: 0});
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    spaces[1].tile = {tileType: TileType.MOON_ROAD};
    player.titanium = 2;
    player.production.override({energy: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    player.production.override({energy: 1, megacredits: 0});
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(3);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(1);
  });
});

