import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast, churn, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {MarsNomads} from '../../../src/server/cards/promo/MarsNomads';
import {Networker} from '../../../src/server/milestones/Networker';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {MarsBoard} from '../../../src/server/boards/MarsBoard';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Philares} from '../../../src/server/cards/promo/Philares';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {LandClaim} from '../../../src/server/cards/base/LandClaim';
import {MiningGuild} from '../../../src/server/cards/corporation/MiningGuild';
import {intersection} from '../../../src/common/utils/utils';

describe('MarsNomads', () => {
  let card: MarsNomads;
  let board: MarsBoard;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

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

    const space19 = board.getSpaceOrThrow('19');

    expect(cast(card.action(player), SelectSpace).spaces).to.contain(space19);

    game.simpleAddTile(player, space19, {tileType: TileType.GREENERY});

    expect(cast(card.action(player), SelectSpace).spaces).to.not.contain(space19);
  });

  it('Action does not gets adjacency bonus', () => {
    const destinationSpace = game.board.getSpaceOrThrow('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the natural preserve.
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.NATURAL_PRESERVE});
    adjacentSpaces[0].adjacency = {bonus: [SpaceBonus.MEGACREDITS]};
    game.nomadSpace = adjacentSpaces[1].id;

    player.megaCredits = 0;
    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Action does not get milestone benefit from adjacency', () => {
    const destinationSpace = game.board.getSpaceOrThrow('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the natural preserve.
    game.simpleAddTile(player2, adjacentSpaces[0], {tileType: TileType.NATURAL_PRESERVE});
    adjacentSpaces[0].adjacency = {bonus: [SpaceBonus.MEGACREDITS]};
    game.nomadSpace = adjacentSpaces[1].id;

    const milestone = new Networker();
    expect(milestone.getScore(player)).eq(0);

    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);

    expect(player.megaCredits).to.eq(0);
    expect(milestone.getScore(player)).eq(0);
  });

  it('Action gains ocean bonus', () => {
    const destinationSpace = game.board.getSpaceOrThrow('04');
    const adjacentSpaces = game.board.getAdjacentSpaces(destinationSpace);

    // Nomad will move to destinationSpace, which is next to both the current nomad space, and the ocean.
    adjacentSpaces[0].tile = {tileType: TileType.OCEAN};
    game.nomadSpace = adjacentSpaces[1].id;

    player.megaCredits = 0;
    const selectSpace = cast(card.action(player), SelectSpace);
    selectSpace.cb(destinationSpace);
    expect(player.megaCredits).to.eq(2);
  });

  it('Can make initial placement on an ocean bonus space even without the money (Bug #6479)', () => {
    player.megaCredits = 0;
    const space3 = game.board.getSpaceOrThrow('03');
    expect(space3.spaceType).eq(SpaceType.LAND);
    space3.bonus = [SpaceBonus.OCEAN];

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).contains(space3);
    selectSpace.cb(space3);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.getTerraformRating()).eq(20);

    space3.bonus = [SpaceBonus.TEMPERATURE];
    selectSpace.cb(space3);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(game.getTemperature()).eq(-30);
    expect(player.getTerraformRating()).eq(20);
  });

  it('Compatible with Land Claim on placement', () => {
    const space = game.board.getAvailableSpacesOnLand(player)[0];

    expect(cast(card.play(player), SelectSpace).spaces).to.include(space);

    const landClaim = new LandClaim();
    const selectSpace = cast(landClaim.play(player), SelectSpace);

    expect(selectSpace.spaces).to.include(space);

    selectSpace.cb(space);

    const spaces = cast(card.play(player), SelectSpace).spaces;
    expect(spaces).to.not.include(space);

    const adjacentSpace = intersection(game.board.getAdjacentSpaces(space), spaces)[0];
    game.nomadSpace = adjacentSpace.id;
  });

  it('Compatible with Land Claim movement', () => {
    const availableSpaces = game.board.getAvailableSpacesOnLand(player);
    const space = availableSpaces[0];
    const adjacentSpace = intersection(game.board.getAdjacentSpaces(space), availableSpaces)[0];
    game.nomadSpace = space.id;
    const selectSpace = cast(churn(card.action(player), player), SelectSpace);

    expect(selectSpace.spaces).includes(adjacentSpace);

    adjacentSpace.player = player;
    const selectSpace2 = cast(churn(card.action(player), player), SelectSpace);

    expect(selectSpace2.spaces).to.not.include(adjacentSpace);
  });

  describe('Compatible with Philares', () => {
    let philares: Philares;

    beforeEach(() => {
      game.board = EmptyBoard.newInstance();
      philares = new Philares();
      player2.corporations.push(philares);
    });

    it('Placement does not trigger Philares', () => {
      // Nomad will start at nomadSpace, and move to destinationSpace,
      // which is next to both the current nomad space, and Philares.
      const destinationSpace = game.board.getSpaceOrThrow('04');
      const [philaresSpace, nomadSpace] = game.board.getAdjacentSpaces(destinationSpace);

      game.simpleAddTile(player2, philaresSpace, {tileType: TileType.NATURAL_PRESERVE});
      const selectSpace = cast(card.play(player), SelectSpace);
      expect(selectSpace.spaces).contains(nomadSpace);
      selectSpace.cb(nomadSpace);
      expect(game.nomadSpace).eq(nomadSpace.id);
      runAllActions(game);
      expect(player2.popWaitingFor()).is.undefined;
    });

    it('Move does not trigger Philares', () => {
      // Nomad will start at nomadSpace, and move to destinationSpace,
      // which is next to both the current nomad space, and Philares.
      const destinationSpace = game.board.getSpaceOrThrow('04');
      const [philaresSpace, nomadSpace] = game.board.getAdjacentSpaces(destinationSpace);

      game.simpleAddTile(player2, philaresSpace, {tileType: TileType.NATURAL_PRESERVE});
      game.nomadSpace = nomadSpace.id;
      const selectSpace = cast(card.action(player), SelectSpace);
      expect(selectSpace.spaces).contains(destinationSpace);
      selectSpace.cb(destinationSpace);
      expect(game.nomadSpace).eq(destinationSpace.id);
      runAllActions(game);
      expect(player2.popWaitingFor()).is.undefined;
    });
  });

  describe('Compatible with Mining Guild', () => {
    let miningGuild: MiningGuild;

    beforeEach(() => {
      game.board = EmptyBoard.newInstance();
      miningGuild = new MiningGuild();
      player.corporations.push(miningGuild);
    });

    it('Placement does not trigger Mining Guild', () => {
      const space = game.board.getSpaceOrThrow('04');

      const selectSpace = cast(card.play(player), SelectSpace);
      space.bonus = [SpaceBonus.STEEL];
      expect(selectSpace.spaces).contains(space);
      selectSpace.cb(space);
      runAllActions(game);

      expect(game.nomadSpace).eq(space.id);
      expect(player.steel).eq(0);
      expect(player.production.steel).eq(0);
    });

    it('Move does not trigger Mining Guild', () => {
      const firstSpace = game.board.getSpaceOrThrow('05');
      const space = game.board.getSpaceOrThrow('04');
      game.nomadSpace = firstSpace.id;

      const selectSpace = cast(card.action(player), SelectSpace);
      space.bonus = [SpaceBonus.STEEL];
      expect(selectSpace.spaces).contains(space);
      selectSpace.cb(space);
      runAllActions(game);

      expect(game.nomadSpace).eq(space.id);
      expect(player.steel).eq(1);
      expect(player.production.steel).eq(0);
    });
  });
});
