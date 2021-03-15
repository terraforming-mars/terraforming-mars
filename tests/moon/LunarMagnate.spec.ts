import {expect} from 'chai';
import {LunarMagnate} from '../../src/moon/LunarMagnate';
import {TestPlayers} from '../TestPlayers';
import {Game} from '../../src/Game';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {TestPlayer} from '../TestPlayer';
import {TestingUtils} from '../TestingUtils';
import {TileType} from '../../src/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarMagnate', function() {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.PINK.newPlayer();
    Game.newInstance('id', [player, otherPlayer], player, MOON_OPTIONS);
  });

  it('Basic test', function() {
    const award = new LunarMagnate();
    expect(award.getScore(player)).eq(0);
    MoonExpansion.addTile(player, 'm01', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(1);
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(2);
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(3);
    MoonExpansion.addTile(player, 'm04', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(4);
    MoonExpansion.addTile(player, 'm05', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(5);
    MoonExpansion.addTile(player, 'm06', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(6);

    expect(award.getScore(otherPlayer)).eq(0);
    MoonExpansion.addTile(otherPlayer, 'm07', {tileType: TileType.MOON_MINE});
    expect(award.getScore(player)).eq(6);
    expect(award.getScore(otherPlayer)).eq(1);
  });
});
