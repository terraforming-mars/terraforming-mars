import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunarMineUrbanization} from '../../../src/cards/moon/LunarMineUrbanization';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {VictoryPointsBreakdown} from '../../../src/VictoryPointsBreakdown';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarMineUrbanization', () => {
  let player: TestPlayer;
  let card: LunarMineUrbanization;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunarMineUrbanization();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];

    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;
    expect(player.getPlayableCards()).does.include(card);

    space.player = undefined;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    const space = moonData.moon.getAvailableSpacesOnLand(player)[0];
    space.tile = {tileType: TileType.MOON_MINE};
    space.player = player;

    player.setProductionForTest({megacredits: 0});
    moonData.colonyRate = 0;
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    const action = card.play(player);

    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_COLONY)).eql([]);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    action.cb(space);

    expect(space.tile!.tileType).eq(TileType.LUNAR_MINE_URBANIZATION);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_MINE)).eql([space]);
    expect(MoonExpansion.spaces(player.game, TileType.MOON_COLONY)).eql([space]);
    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('computeVictoryPoints', () => {
    const vps = new VictoryPointsBreakdown();
    function computeVps() {
      vps.points.moonColonies = 0;
      vps.points.moonMines = 0;
      vps.points.moonRoads = 0;
      MoonExpansion.calculateVictoryPoints(player, vps);
      return {
        colonies: vps.points.moonColonies,
        mines: vps.points.moonMines,
        roads: vps.points.moonRoads,
      };
    }

    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});
    MoonExpansion.calculateVictoryPoints(player, vps);
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 1});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.LUNAR_MINE_URBANIZATION});

    expect(computeVps()).eql({colonies: 1, mines: 1, roads: 1});
  });
});
