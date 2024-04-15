import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {testGame} from '../../TestGame';
import {addGreenery, addCity, cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Gaia} from '../../../src/server/cards/ceos/Gaia';
import {NaturalPreserveAres} from '../../../src/server/cards/ares/NaturalPreserveAres';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {Networker} from '../../../src/server/milestones/Networker';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';

describe('Gaia', function() {
  let card: Gaia;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Gaia();
    [game, player, player2, player3] = testGame(3, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
    player.playedCards.push(card);
  });

  it('Takes action', function() {
    // Place a tile that grants 1MC adjacency bonuses
    const naturalPreserveAres = new NaturalPreserveAres();
    naturalPreserveAres.play(player2);
    runAllActions(game);
    const action = cast(player2.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    addGreenery(player2, adjacentSpaces[0].id);
    addCity(player3, adjacentSpaces[1].id);

    // Gain adjacency bonuses of all players' tiles
    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(2);
  });

  it('Takes action, does not gain bonuses from Oceans', function() {
    // Place a tile that grants 1MC adjacency bonuses
    const naturalPreservesSpace = game.board.getSpaceOrThrow('04');
    game.simpleAddTile(player2, naturalPreservesSpace, {tileType: TileType.NATURAL_PRESERVE});
    naturalPreservesSpace.adjacency = {bonus: [SpaceBonus.MEGACREDITS]};

    // Place an Ocean adjacent
    const adjacentSpace = game.board.getAdjacentSpaces(naturalPreservesSpace)[0];
    adjacentSpace.tile = {tileType: TileType.OCEAN};

    // Take action, do not gain MC from Ocean adjacency
    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(0);
  });

  it('Takes action, Networker Milestone does not get a benefit', function() {
    // Place a tile that grants 1MC adjacency bonuses
    const naturalPreservesSpace = game.board.getSpaceOrThrow('04');
    game.simpleAddTile(player2, naturalPreservesSpace, {tileType: TileType.NATURAL_PRESERVE});
    naturalPreservesSpace.adjacency = {bonus: [SpaceBonus.MEGACREDITS]};

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(naturalPreservesSpace);
    addGreenery(player2, adjacentSpaces[0].id);
    addCity(player3, adjacentSpaces[1].id);

    const milestone = new Networker();
    expect(milestone.getScore(player)).eq(0);
    // Gain adjacency bonuses of all players' tiles
    card.action(player);
    expect(milestone.getScore(player)).eq(0);
  });

  it('Takes action, owner of the adjacency bonus tile does not gain MC', function() {
    // Place a tile that grants 1MC adjacency bonuses
    const naturalPreservesSpace = game.board.getSpaceOrThrow('04');
    game.simpleAddTile(player2, naturalPreservesSpace, {tileType: TileType.NATURAL_PRESERVE});
    naturalPreservesSpace.adjacency = {bonus: [SpaceBonus.MEGACREDITS]};

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(naturalPreservesSpace);
    addGreenery(player2, adjacentSpaces[0].id);
    addCity(player3, adjacentSpaces[1].id);

    const oldPlayer2MC = player2.megaCredits;
    // Gain adjacency bonuses of all players' tiles
    card.action(player);
    expect(player2.megaCredits).eq(oldPlayer2MC);
  });


  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
