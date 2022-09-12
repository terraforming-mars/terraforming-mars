import {expect} from 'chai';
import {Lunarchitect} from '../../src/server/moon/Lunarchitect';
import {Game} from '../../src/server/Game';
import {MoonExpansion} from '../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../TestPlayer';
import {testGameOptions} from '../TestingUtils';
import {TileType} from '../../src/common/TileType';

describe('Lunarchitect', function() {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.PINK.newPlayer();
    Game.newInstance('gameid', [player, otherPlayer], player, testGameOptions({moonExpansion: true}));
  });

  it('Basic test', function() {
    const milestone = new Lunarchitect();
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm01', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm04', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm05', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm06', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.true;
  });


  it('Other player tokens do not count', function() {
    const milestone = new Lunarchitect();
    expect(milestone.canClaim(player)).is.not.true;
    MoonExpansion.addTile(player, 'm01', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm04', {tileType: TileType.MOON_MINE});
    MoonExpansion.addTile(player, 'm05', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;

    MoonExpansion.addTile(otherPlayer, 'm06', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.not.true;

    MoonExpansion.addTile(player, 'm07', {tileType: TileType.MOON_MINE});
    expect(milestone.canClaim(player)).is.true;
  });
});
