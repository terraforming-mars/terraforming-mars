import {PolderTechDutch} from '../../../src/server/cards/promo/PolderTechDutch';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {expect} from 'chai';
import {addCity, addGreenery, addOcean, cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {assertPlaceGreenery, assertPlaceOcean} from '../../assertions';

describe('PolderTechDutch', () => {
  it('Initial action', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2);

    card.initialAction(player);
    runAllActions(game);

    const oceanSpace = assertPlaceOcean(player, player.popWaitingFor());

    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const spacesNextToOcean = game.board.getAdjacentSpaces(oceanSpace);

    expect(selectSpace.spaces).to.have.members(spacesNextToOcean);

    assertPlaceGreenery(player, selectSpace);
  });

  it('Initial action - ignore existing tiles', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2);

    card.initialAction(player);
    runAllActions(game);

    const oceanSpace = assertPlaceOcean(player, player.popWaitingFor());
    expect(oceanSpace.id).eq('04');

    // City is all the way on the other side of the map.
    addCity(player, '42');

    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const spacesNextToOcean = game.board.getAdjacentSpaces(oceanSpace);

    expect(selectSpace.spaces).to.have.members(spacesNextToOcean);

    assertPlaceGreenery(player, selectSpace);
  });

  it('Cannot choose the middle ocean on Hellas', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS});

    card.initialAction(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const middleOceanSpace = game.board.getSpaceOrThrow('35');
    expect(selectSpace.spaces).to.not.include([middleOceanSpace]);
    const neighbors = game.board.getAdjacentSpaces(middleOceanSpace);
    expect(neighbors.every((space) => space.spaceType === SpaceType.OCEAN)).is.true;
  });

  it('Effect, ocean', () => {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2, {boardName: BoardName.HELLAS});
    game.board.spaces.forEach((space) => space.bonus = []);
    player.playedCards.push(card);
    addOcean(player);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(0);

    addOcean(player2);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(0);
  });

  it('Effect, greenery', () => {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2, {boardName: BoardName.HELLAS});
    game.board = EmptyBoard.newInstance();
    player.playedCards.push(card);
    addGreenery(player);

    expect(player.plants).eq(1);
    expect(player2.plants).eq(0);

    addGreenery(player2);

    expect(player.plants).eq(1);
    expect(player2.plants).eq(0);
  });
});
