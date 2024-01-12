import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {MarsNomads} from '../../../src/server/cards/promo/MarsNomads';
import {Networker} from '../../../src/server/milestones/Networker';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {MarsBoard} from '../../../src/server/boards/MarsBoard';
import {TileType} from '../../../src/common/TileType';

describe('MarsNomads', function() {
  let card: MarsNomads;
  let board: MarsBoard;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new MarsNomads();
    [game, player, player2] = testGame(2, {aresExtension: true});
    board = game.board;
  });

  it('play, gains no bonus', () => {
    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];
    space.bonus = [SpaceBonus.PLANT];
    selectSpace.cb(space);
    expect(player.plants).eq(0);
  });

  it('No tiles may be placed on the nomad space', () => {
    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(board.getAvailableSpacesOnLand(player)).includes(space);

    selectSpace.cb(space);

    expect(board.getAvailableSpacesOnLand(player)).does.not.include(space);
  });

  it('action gains bonus', () => {
    // 12 is an arbitrary index.
    const space = board.getAvailableSpacesOnLand(player)[12];
    board.getAdjacentSpaces(space).forEach((s) => s.bonus = [SpaceBonus.STEEL]);
    game.nomadSpace = space.id;
    expect(card.canAct(player)).is.true;

    const selectSpace = cast(card.action(player), SelectSpace);
    const nextSpace = selectSpace.spaces[0];
    selectSpace.cb(nextSpace);

    expect(game.nomadSpace).eq(nextSpace.id);
    expect(player.steel).eq(1);
  });

  it('Nomads only moves to adjacent unreserved spaces', () => {
    // 12 is an arbitrary index.
    const space = board.getAvailableSpacesOnLand(player)[12];
    game.nomadSpace = space.id;

    const selectSpace = cast(card.action(player), SelectSpace);
    expect(selectSpace.spaces.map((s) => s.id)).to.have.members(['19', '27']);
  });

  it('Nomads only moves to empty spaces', () => {
    // 12 is an arbitrary index.
    const space = board.getAvailableSpacesOnLand(player)[12];
    game.nomadSpace = space.id;

    const space19 = board.getSpace('19');

    expect(cast(card.action(player), SelectSpace).spaces).to.contain(space19);

    game.simpleAddTile(player, space19, {tileType: TileType.GREENERY});

    expect(cast(card.action(player), SelectSpace).spaces).to.not.contain(space19);
  });

  it('Action gets adjacency bonus', function() {
    const destinationSpace = game.board.getSpace('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the natural preserve.
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.NATURAL_PRESERVE});
    adjacentSpaces[0].adjacency = {bonus: [SpaceBonus.MEGACREDITS]};
    game.nomadSpace = adjacentSpaces[1].id;

    player.megaCredits = 0;
    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);

    expect(player.megaCredits).to.eq(1);
  });

  it('Action does not get milestone benefit from adjacency', function() {
    const destinationSpace = game.board.getSpace('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the natural preserve.
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.NATURAL_PRESERVE});
    adjacentSpaces[0].adjacency = {bonus: [SpaceBonus.MEGACREDITS]};
    game.nomadSpace = adjacentSpaces[1].id;

    const milestone = new Networker();
    expect(milestone.getScore(player)).eq(0);

    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);

    // Gain adjacency bonuses of all players' tiles
    expect(player.megaCredits).to.eq(1);
    expect(milestone.getScore(player)).eq(0);
  });

  it('action gains ocean bonus', function() {
    const destinationSpace = game.board.getSpace('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the ocean.
    adjacentSpaces[0].tile = {tileType: TileType.OCEAN};
    game.nomadSpace = adjacentSpaces[1].id;

    player.megaCredits = 0;
    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);
    expect(player.megaCredits).to.eq(2);
  });
});
