import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {SmallDutyRovers} from '../../../src/cards/moon/SmallDutyRovers';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('SmallDutyRovers', () => {
  let player: Player;
  let card: SmallDutyRovers;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new SmallDutyRovers();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;
    player.megaCredits = 0;
    // remove space bonuses to keep this simple.
    moonData.moon.spaces.forEach((space) => {
      space.bonus = [];
    });

    MoonExpansion.addTile(player, 'm04', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm05', {tileType: TileType.MOON_COLONY});
    MoonExpansion.addTile(player, 'm06', {tileType: TileType.MOON_ROAD});
    MoonExpansion.addTile(player, 'm07', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm08', {tileType: TileType.MOON_COLONY});
    MoonExpansion.addTile(player, 'm09', {tileType: TileType.MOON_ROAD});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.megaCredits).eq(6);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

