import {IGame} from '../../../src/server/IGame';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';
import {expect} from 'chai';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {Capital} from '../../../src/server/cards/base/Capital';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {addOcean, cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {toID} from '../../../src/common/utils/utils';

describe('OceanCity', () => {
  let card: OceanCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OceanCity();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Can play', () => {
    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const oceanSpace = addOcean(player);
    player.production.add(Resource.ENERGY, 1);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(3);
    expect(game.board.getCitiesOnMars()).is.empty;
    expect(player.game.board.getCities(player)).is.empty;

    action.cb(oceanSpace);

    expect(game.board.getCitiesOnMars()).has.length(1);
    expect(player.game.board.getCities(player)).has.length(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Cannot place a city next to Ocean City', () => {
    const oceanSpace = addOcean(player);
    player.production.add(Resource.ENERGY, 1);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(oceanSpace);

    const adjacentSpaces = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)
      .map(toID);
    const citySpaces = game.board
      .getAvailableSpacesForCity(player)
      .map(toID);
    expect(citySpaces).to.not.include.any.members(adjacentSpaces);
  });

  it('Can place Ocean City next to a city', () => {
    const oceanSpace = addOcean(player);
    player.production.add(Resource.ENERGY, 1);

    const citySpace = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];
    game.addCity(player, citySpace);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Ocean City counts as ocean for adjacency', () => {
    const oceanSpace = addOcean(player);
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);
    const greenery = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(player.megaCredits).eq(0);

    game.addGreenery(player, greenery);

    expect(player.megaCredits).eq(2);
  });

  it('Ocean City counts for city-related VP', () => {
    const oceanSpace = addOcean(player);
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);
    const greenery = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(player.getVictoryPoints().city).eq(0);

    game.addGreenery(player, greenery);

    expect(player.getVictoryPoints().city).eq(1);
  });

  it('Ocean City counts as VP for Capital', () => {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];

    const capital = new Capital();
    capital.play(player);
    runAllActions(game);
    const capitalAction = cast(player.popWaitingFor(), SelectSpace);
    player.playedCards = [capital];

    const capitalSpace = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];
    capitalAction.cb(capitalSpace);

    // In a real game Capital couldn't be placed without an ocean on the board, but this test
    // works around that to guarantee zero points.
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);

    // And now adds the tile.
    game.addOcean(player, oceanSpace);
    card.play(player);
    runAllActions(game);
    const oceanCityAction = cast(player.popWaitingFor(), SelectSpace);

    oceanCityAction.cb(oceanSpace);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);

    expect(player.getVictoryPoints().victoryPoints).to.eq(1);
  });

  it('Placing Ocean City does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 0;
    game.addOcean(player, oceanSpace);
    expect(player.plants).eq(1);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.plants).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
    expect(player.plants).eq(1);
  });
});
