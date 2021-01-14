import {expect} from 'chai';
import {ISpace} from '../../src/boards/ISpace';
import {Game} from '../../src/Game';
import {IMoonData} from '../../src/moon/IMoonData';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {Player} from '../../src/Player';
import {SpaceName} from '../../src/SpaceName';
import {TileType} from '../../src/TileType';
import {setCustomGameOptions, TestPlayers} from '../TestingUtils';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('MoonExpansion', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    expect(player.getTerraformRating()).eq(14);
    MoonExpansion.raiseMiningRate(player);
    expect(moonData.miningRate).to.eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});
