import {PolderTechDutch} from '../../../src/server/cards/promo/PolderTechDutch';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {expect} from 'chai';
import {addCity, addGreenery, addOcean, fakeCard, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {assertPlaceGreenery, assertPlaceOcean} from '../../assertions';
import {cast, intersection} from '../../../src/common/utils/utils';
import {Phase} from '../../../src/common/Phase';
import {TileType} from '@/common/TileType';
import {CardName} from '@/common/cards/CardName';
import {AresHandler} from '@/server/ares/AresHandler';
import {OrOptions} from '@/server/inputs/OrOptions';

describe('PolderTechDutch', () => {
  it('Initial action', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2);

    cast(card.initialAction(player), OrOptions).options[0].cb();
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

    cast(card.initialAction(player), OrOptions).options[0].cb();
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

    cast(card.initialAction(player), OrOptions).options[0].cb();
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const middleOceanSpace = game.board.getSpaceOrThrow('35');

    expect(selectSpace.spaces).to.not.include([middleOceanSpace]);

    const neighbors = game.board.getAdjacentSpaces(middleOceanSpace);

    expect(neighbors.every((space) => space.spaceType === SpaceType.OCEAN)).is.true;
  });

  it('Effect, ocean', () => {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2);
    game.board.spaces.forEach((space) => space.bonus = []);
    player.playedCards.push(card);
    addOcean(player);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(0);

    addOcean(player2);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(0);
  });

  it('Effect, ocean, no energy during World Government Terraforming', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2);
    game.board.spaces.forEach((space) => space.bonus = []);
    player.playedCards.push(card);

    // The World Government Terraforming action runs during the solar phase, and
    // the active player places the ocean, but the effect should not trigger.
    game.phase = Phase.SOLAR;
    addOcean(player);

    expect(player.energy).eq(0);
  });

  it('Effect, greenery', () => {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2);
    game.board.spaces.forEach((space) => space.bonus = []);
    player.playedCards.push(card);
    addGreenery(player);

    expect(player.plants).eq(1);
    expect(player2.plants).eq(0);

    addGreenery(player2);

    expect(player.plants).eq(1);
    expect(player2.plants).eq(0);
  });

  it('Initial action - wins over Red City', () => {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2);
    game.simpleAddTile(player2, game.board.getSpaceOrThrow('10'), {tileType: TileType.RED_CITY, card: CardName.RED_CITY});

    cast(card.initialAction(player), OrOptions).options[0].cb();
    runAllActions(game);

    const oceanSpace = assertPlaceOcean(player, player.popWaitingFor());
    expect(oceanSpace.id).eq('04');

    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.have.members(['03', '05', '09']);
  });

  it('Initial action - Ares, no warning when the ocean places no erosions', () => {
    const card = new PolderTechDutch();
    const [, player] = testGame(2, {expansions: {ares: true}, aresHazards: true});

    const orOptions = cast(card.initialAction(player), OrOptions);

    expect(orOptions.warning).is.undefined;
  });

  // A game where PolderTech's ocean is the third, and its erosion lands on 03, the only greenery space next to 04.
  function erosionGame() {
    const card = new PolderTechDutch();
    const [game, player, player2] = testGame(2, {expansions: {ares: true}, aresHazards: true});
    // Clears the dust storms placed during game setup by removing every hazard tile. Their spaces depend on random
    // draws of the project deck and one on or near 03 would change where the erosion lands and what placement costs.
    for (const space of game.board.spaces) {
      if (AresHandler.hasHazardTile(space)) {
        space.tile = undefined;
      }
    }
    for (const id of ['05', '09', '10'] as const) {
      game.simpleAddTile(player2, game.board.getSpaceOrThrow(id), {tileType: TileType.CITY});
    }
    const space4 = game.board.getSpaceOrThrow('04');
    const space3 = game.board.getSpaceOrThrow('03');
    // 03 is the only land next to 04, where the ocean will go.
    expect(
      intersection(
        game.board.getAvailableSpacesOnLand(player),
        game.board.getAdjacentSpaces(space4)))
      .deep.eq([space3]);

    // Two oceans already on the board, so PolderTech's ocean is the third, which places erosions.
    addOcean(player2, '45');
    addOcean(player2, '63');
    // Zero-cost cards put the top erosion on the first available land space, 03.
    game.projectDeck.drawPile.push(fakeCard({cost: 0}), fakeCard({cost: 0}));
    // This will make it so the player can't afford the cost of placing on top of the erosion.
    player.megaCredits = 0;

    return {card, game, player, space3, space4};
  }

  it('Initial action - Ares, ocean first, erosion leaves no greenery space', () => {
    const {card, game, player, space3, space4} = erosionGame();

    const orOptions = cast(card.initialAction(player), OrOptions);
    expect(orOptions.warning).is.not.undefined;
    orOptions.options[0].cb();
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces).to.include(space4);
    expect(space3.tile).is.undefined;
    selectSpace.cb(space4);
    expect(space3.tile?.tileType).eq(TileType.EROSION_MILD);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });

  it('Initial action - Ares, greenery first', () => {
    const {card, game, player, space3, space4} = erosionGame();

    const orOptions = cast(card.initialAction(player), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);

    const selectGreenery = cast(player.popWaitingFor(), SelectSpace);

    expect(selectGreenery.spaces).to.include(space3);
    selectGreenery.cb(space3);
    runAllActions(game);

    const selectOcean = cast(player.popWaitingFor(), SelectSpace);

    expect(selectOcean.spaces).to.have.members([space4]);
    selectOcean.cb(space4);

    expect(space3.tile?.tileType).eq(TileType.GREENERY);
    expect(space4.tile?.tileType).eq(TileType.OCEAN);
  });

  it('Initial action - greenery first', () => {
    const card = new PolderTechDutch();
    const [game, player] = testGame(2);
    const space3 = game.board.getSpaceOrThrow('03');
    const space4 = game.board.getSpaceOrThrow('04');
    // 08 is land with no ocean space next to it.
    const space8 = game.board.getSpaceOrThrow('08');

    cast(card.initialAction(player), OrOptions).options[1].cb();
    runAllActions(game);

    const selectGreenery = cast(player.popWaitingFor(), SelectSpace);

    expect(selectGreenery.spaces).to.include(space3);
    expect(selectGreenery.spaces).to.not.include(space8);

    selectGreenery.cb(space3);
    runAllActions(game);

    expect(space3.tile?.tileType).eq(TileType.GREENERY);
    expect(game.getOxygenLevel()).eq(1);

    const selectOcean = cast(player.popWaitingFor(), SelectSpace);

    expect(selectOcean.spaces).to.have.members([space4]);

    selectOcean.cb(space4);

    expect(space4.tile?.tileType).eq(TileType.OCEAN);
  });
});
