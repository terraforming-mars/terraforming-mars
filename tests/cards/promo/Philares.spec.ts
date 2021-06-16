import {Philares} from '../../../src/cards/promo/Philares';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {SpaceType} from '../../../src/SpaceType';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {TileType} from '../../../src/TileType';
import {ISpace} from '../../../src/boards/ISpace';
import {expect} from 'chai';
import {Phase} from '../../../src/Phase';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/Units';

describe('Philares', () => {
  let card : Philares;
  let player : TestPlayer;
  let redPlayer: TestPlayer;
  let game: Game;
  let space: ISpace;
  let adjacentSpace: ISpace;
  let adjacentSpace2: ISpace;

  beforeEach(() => {
    card = new Philares();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    game.board = EmptyBoard.newInstance();
    space = game.board.spaces[4];
    adjacentSpace = game.board.getAdjacentSpaces(space)[0];
    adjacentSpace2 = game.board.getAdjacentSpaces(space)[2];

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

  it('one tile one bonus', () => {
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    const action = game.deferredActions.pop();
    const options = action?.execute() as AndOptions;
    // Options are ordered 0-5, MC to heat.
    expect(player.purse()).deep.eq(Units.EMPTY);
    options.options[0].cb(1);
    options.cb();
    expect(player.purse()).deep.eq(Units.of({megacredits: 1}));
  });

  it('one tile one bonus - player is greedy', () => {
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    const action = game.deferredActions.pop();
    const options = action?.execute() as AndOptions;
    // Options are ordered 0-5, MC to heat.
    expect(player.purse()).deep.eq(Units.EMPTY);
    options.options[0].cb(1);
    options.options[1].cb(1);
    expect(() => options.cb()).to.throw('Need to select 1 resource(s)');
  });

  it('Multiple bonuses when placing next to multiple tiles', () => {
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace2, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(1);
    const action = game.deferredActions.pop();
    const options = action?.execute() as AndOptions;
    // Options are ordered 0-5, MC to heat.
    expect(player.purse()).deep.eq(Units.EMPTY);
    options.options[0].cb(1);
    options.options[1].cb(1);
    options.cb();
    expect(player.purse()).deep.eq(Units.of({megacredits: 1, steel: 1}));
  });

  it('Multiple bonuses when opponent places next to multiple of your tiles', () => {
    game.addTile(player, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    game.addTile(player, SpaceType.LAND, adjacentSpace2, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(0);
    game.addTile(redPlayer, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    expect(game.deferredActions).has.length(1);
    const action = game.deferredActions.pop();
    const options = action?.execute() as AndOptions;
    // Options are ordered 0-5, MC to heat.
    expect(player.purse()).deep.eq(Units.EMPTY);
    options.options[0].cb(1);
    options.options[1].cb(1);
    options.cb();
    expect(player.purse()).deep.eq(Units.of({megacredits: 1, steel: 1}));
  });

  it('two tiles two bonuses - player is greedy', () => {
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace, {tileType: TileType.GREENERY});
    game.addTile(redPlayer, SpaceType.LAND, adjacentSpace2, {tileType: TileType.GREENERY});
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.GREENERY});
    const action = game.deferredActions.pop();
    const options = action?.execute() as AndOptions;
    // Options are ordered 0-5, MC to heat.
    expect(player.purse()).deep.eq(Units.EMPTY);
    options.options[0].cb(1);
    options.options[1].cb(1);
    options.options[2].cb(1);
    expect(() => options.cb()).to.throw('Need to select 2 resource(s)');
  });
});
