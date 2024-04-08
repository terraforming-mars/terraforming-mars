import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SmallDutyRovers} from '../../../src/server/cards/moon/SmallDutyRovers';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';

describe('SmallDutyRovers', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: SmallDutyRovers;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new SmallDutyRovers();
    moonData = MoonExpansion.moonData(game);
    // remove space bonuses to keep this simple.
    moonData.moon.spaces.forEach((space) => {
      space.bonus = [];
    });
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;
    player.megaCredits = 0;

    MoonExpansion.addTile(player, 'm04', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm05', {tileType: TileType.MOON_HABITAT});
    MoonExpansion.addTile(player, 'm06', {tileType: TileType.MOON_ROAD});
    MoonExpansion.addTile(player, 'm07', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm08', {tileType: TileType.MOON_HABITAT});
    MoonExpansion.addTile(player, 'm09', {tileType: TileType.MOON_ROAD});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.megaCredits).eq(6);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('compatible with Lunar Mine Urbanization', () => {
    expect(moonData.logisticRate).eq(0);
    player.titanium = 1;
    player.megaCredits = 0;

    MoonExpansion.addTile(player, 'm06', {tileType: TileType.LUNAR_MINE_URBANIZATION});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.megaCredits).eq(2);
  });
});

