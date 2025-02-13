import {expect} from 'chai';
import {Lunarchitect} from '../../src/server/moon/Lunarchitect';
import {MoonExpansion} from '../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../TestPlayer';
import {TileType} from '../../src/common/TileType';
import {testGame} from '../TestGame';

describe('Lunarchitect', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;

  beforeEach(() => {
    [/* game */, player, otherPlayer] = testGame(2, {moonExpansion: true});
  });

  it('Basic test', () => {
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

  it('Other player tokens do not count', () => {
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
