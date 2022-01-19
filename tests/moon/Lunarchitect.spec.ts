import {expect} from 'chai';
import {Lunarchitect} from '../../src/moon/Lunarchitect';
import {TestPlayers} from '../TestPlayers';
import {Game} from '../../src/Game';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {TestPlayer} from '../TestPlayer';
import {TestingUtils} from '../TestingUtils';
import {TileType} from '../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('Lunarchitect', function() {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.PINK.newPlayer();
    Game.newInstance('id', [player, otherPlayer], player, MOON_OPTIONS);
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
