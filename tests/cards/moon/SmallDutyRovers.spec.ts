import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SmallDutyRovers} from '../../../src/server/cards/moon/SmallDutyRovers';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

describe('SmallDutyRovers', () => {
  let player: Player;
  let card: SmallDutyRovers;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
});

