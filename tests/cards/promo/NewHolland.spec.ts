import {IGame} from '../../../src/server/IGame';
import {NewHolland} from '../../../src/server/cards/promo/NewHolland';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {addCity, addOcean, cast, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {partition, toID} from '../../../src/common/utils/utils';
import {Board} from '../../../src/server/boards/Board';

// There's a fair bit of code duplication from OceanCity. Rather a lot really.
describe('NewHolland', () => {
  let card: NewHolland;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NewHolland();
    [game, player/* , player2 */] = testGame(2);
  });

  it('Can play', () => {
    // Playing requires four cities already on the map. It also requires an ocean that is not next to a city.
    // (Unless of course there are some effects that change city placement.)
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    addCity(player);
    addCity(player);
    addCity(player);
    addCity(player);

    expect(card.canPlay(player)).is.false;

    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);

    // Split into
    const [nextToCity, notNextToCity] = partition(oceanSpaces, (space) => {
      return game.board.getAdjacentSpaces(space).filter((s) => Board.isCitySpace(s)).length > 0;
    });

    addOcean(player, nextToCity[0].id);

    expect(card.canPlay(player)).is.false;

    addOcean(player, notNextToCity[0].id);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const oceanSpace = addOcean(player);

    cast(card.play(player), undefined);
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.plants).eq(0);
    expect(player.production.megacredits).eq(3);
    expect(game.board.getCitiesOnMars()).is.empty;
    expect(player.game.board.getCities(player)).is.empty;

    action.cb(oceanSpace);

    expect(game.board.getCitiesOnMars()).has.length(1);
    expect(player.game.board.getCities(player)).has.length(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.NEW_HOLLAND);
  });

  it('Cannot place a city next to New Holland', () => {
    const oceanSpace = addOcean(player);

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

  it('New Holland counts as ocean for adjacency', () => {
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

  it('New Holland counts for city-related VP', () => {
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

  it('Placing New Holland does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    game.addOcean(player, oceanSpace);
    expect(player.plants).eq(1);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.NEW_HOLLAND);
    expect(player.plants).eq(1);
  });
});
