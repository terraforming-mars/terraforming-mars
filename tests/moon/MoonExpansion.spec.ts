import {expect} from 'chai';
import {ISpace} from '../../src/boards/ISpace';
import {Game} from '../../src/Game';
import {IMoonData} from '../../src/moon/IMoonData';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {Player} from '../../src/Player';
import {SpaceName} from '../../src/SpaceName';
import {TileType} from '../../src/TileType';
import {setCustomGameOptions} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('MoonExpansion', () => {
  let game: Game;
  let player: Player;
  let player2: Player;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.PINK.newPlayer();
    game = Game.newInstance('id', [player, player2], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
  });

  it('addTile', () => {
    MoonExpansion.addTile(player, MoonSpaces.MARE_IMBRIUM, {tileType: TileType.LUNA_TRADE_STATION});
    const space: ISpace = moonData.moon.getSpace(MoonSpaces.MARE_IMBRIUM);
    expect(space.player).eq(player);
    expect(space.tile).deep.eq({tileType: TileType.LUNA_TRADE_STATION});
  });

  it('addTile fails occupied space', () => {
    const space: ISpace = moonData.moon.getSpace(MoonSpaces.MARE_IMBRIUM);
    space.tile = {tileType: TileType.MOON_MINE};
    expect(() => MoonExpansion.addTile(player, MoonSpaces.MARE_IMBRIUM, {tileType: TileType.LUNA_TRADE_STATION})).to.throw(/occupied/);
  });

  it('addTile throws with Mars space', () => {
    expect(() => MoonExpansion.addTile(player, SpaceName.NOCTIS_CITY, {tileType: TileType.LUNA_TRADE_STATION})).to.throw(/.*/);
  });

  it('raiseMiningRate', () => {
    expect(moonData.miningRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseMiningRate(player);
    expect(moonData.miningRate).to.eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('computeVictoryPoints', () => {
    function computeVps() {
      const vps = player.victoryPointsBreakdown;
      vps.moonColonies = 0;
      vps.moonMines = 0;
      vps.moonRoads = 0;
      MoonExpansion.calculateVictoryPoints(player);
      return {
        colonies: vps.moonColonies,
        mines: vps.moonMines,
        roads: vps.moonRoads,
      };
    };

    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});
    MoonExpansion.calculateVictoryPoints(player);
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 1});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_COLONY});

    // Reassign that road to the other player, and our player still gets credit for the colony;
    moonData.moon.getSpace('m02').player = player2;
    expect(computeVps()).eql({colonies: 1, mines: 0, roads: 0});

    // Put a mine in the adjacent space, and the score appropriately follows
    moonData.moon.getSpace('m03').tile = {tileType: TileType.MOON_MINE};
    expect(computeVps()).eql({colonies: 0, mines: 1, roads: 0});

    // Remove the road, and the mine is worth nothing.
    moonData.moon.getSpace('m03').tile = undefined;
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
  });
});
