import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {HeavyDutyRovers} from '../../../src/server/cards/moon/HeavyDutyRovers';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';
import {SpaceId} from '../../../src/common/Types';
import {Player} from '../../../src/server/Player';
import {testGame} from '../../TestGame';
import {Game} from '../../../src/server/Game';

describe('HeavyDutyRovers', () => {
  let player: TestPlayer;
  let game: Game;
  let card: HeavyDutyRovers;
  let moonData: IMoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new HeavyDutyRovers();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.megaCredits = 0;
    moonData.logisticRate = 0;
    expect(player.getTerraformRating()).eq(14);

    moonData.moon.getSpace('m07')!.tile = {tileType: TileType.MOON_MINE};
    moonData.moon.getSpace('m06')!.tile = {tileType: TileType.MOON_ROAD};
    moonData.moon.getSpace('m02')!.tile = {tileType: TileType.MOON_MINE};

    card.play(player);

    expect(player.megaCredits).eq(8);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('issues/5065', () => {
    const [game, player, player2, player3] = testGame(3, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);

    function addTile(spaceId: SpaceId, tileType: TileType, p: Player = player) {
      moonData.moon.getSpace(spaceId)!.tile = {tileType};
      moonData.moon.getSpace(spaceId).player = p;
    }

    player.megaCredits = 0;
    moonData.logisticRate = 0;

    addTile('m02', TileType.MOON_ROAD);
    addTile('m03', TileType.MOON_ROAD);
    addTile('m05', TileType.MOON_MINE);

    addTile('m06', TileType.MOON_MINE);
    addTile('m07', TileType.LUNAR_MINE_URBANIZATION);
    addTile('m08', TileType.MOON_ROAD);
    addTile('m09', TileType.MOON_ROAD);

    addTile('m12', TileType.MOON_ROAD);
    addTile('m13', TileType.MOON_ROAD);
    addTile('m14', TileType.LUNAR_MINE_URBANIZATION);

    addTile('m29', TileType.MOON_ROAD, player2);
    addTile('m31', TileType.MOON_HABITAT);

    addTile('m33', TileType.MOON_ROAD, player2);
    addTile('m34', TileType.MOON_MINE, player2);
    addTile('m35', TileType.MOON_MINE, player3);

    card.play(player);

    expect(player.megaCredits).eq(20);
  });
});

