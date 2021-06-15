import {Philares} from '../../../src/cards/promo/Philares';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {SpaceType} from '../../../src/SpaceType';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {TileType} from '../../../src/TileType';
import {ISpace} from '../../../src/boards/ISpace';
import {expect} from 'chai';
import {Phase} from '../../../src/Phase';

describe('Philares', () => {
  let card : Philares;
  let player : Player;
  let redPlayer: Player;
  let game: Game;
  let space: ISpace;
  let adjacentSpace: ISpace;

  beforeEach(() => {
    card = new Philares();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    game.board = EmptyBoard.newInstance();
    space = game.board.spaces[4];
    adjacentSpace = game.board.getAdjacentSpaces(space)[0];

    player.corporationCard = card;
  });

  it('No bonus when placing next to self', () => {
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.addTile(player, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
  });

  it('bonus when placing next to opponent', () => {
    game.addTile(redPlayer, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.addTile(player, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(1);
  });

  it('bonus when opponent places next to you', () => {
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(1);
  });

  it('placing ocean tile does not grant bonus', () => {
    game.addTile(redPlayer, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    adjacentSpace.spaceType = SpaceType.OCEAN; // Make this space an ocean space.
    game.addTile(player, SpaceType.OCEAN, adjacentSpace, {tileType: TileType.OCEAN});
    expect(game.deferredActions).has.length(0);
  });

  it('ocean tile next to yours does not grant bonus', () => {
    space.spaceType = SpaceType.OCEAN; // Make this space an ocean space.
    game.addTile(redPlayer, SpaceType.OCEAN, space, {tileType: TileType.OCEAN});
    expect(game.deferredActions).has.length(0);
    game.addTile(player, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
  });

  it('No adjacency bonus during WGT', () => {
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.phase = Phase.SOLAR;
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
  });

  it('Multiple bonuses when placing next to multiple tiles', () => {
  });

  it('Multiple bonuses when opponent places next to multiple of your tiles', () => {
  });
});
