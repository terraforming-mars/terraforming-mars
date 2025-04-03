import {IGame} from '../../../src/server/IGame';
import {NewVenice} from '../../../src/server/cards/pathfinders/NewVenice';
import {expect} from 'chai';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Capital} from '../../../src/server/cards/base/Capital';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {addOcean, cast, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {MartianLumberCorp} from '../../../src/server/cards/promo/MartianLumberCorp';
import {toID} from '../../../src/common/utils/utils';

// There's a fair bit of code duplication from OceanCity. Rather a lot really.
describe('NewVenice', () => {
  let card: NewVenice;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NewVenice();
    [game, player/* , player2 */] = testGame(2, {pathfindersExpansion: true});
  });

  it('Can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    addOcean(player);
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    // expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    addOcean(player);
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.plants = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.plants = 2;
    // expect(card.canPlay(player)).is.true;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    const oceanSpace = addOcean(player);
    player.plants = 2;
    player.production.override({energy: 0, megacredits: 0});

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(player.plants).eq(0);
    expect(player.production.megacredits).eq(2);
    expect(player.production.energy).eq(1);
    expect(game.board.getCitiesOnMars()).is.empty;
    expect(player.game.board.getCities(player)).is.empty;

    action.cb(oceanSpace);

    expect(game.board.getCitiesOnMars()).has.length(1);
    expect(player.game.board.getCities(player)).has.length(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Cannot place a city next to New Venice', () => {
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

  it('Can place New Venice next to a city', () => {
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

  it('New Venice counts as ocean for adjacency', () => {
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

  it('New Venice counts for city-related VP', () => {
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

  it('New Venice counts as VP for Capital', () => {
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
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);

    expect(player.getVictoryPoints().victoryPoints).to.eq(1);
  });

  it('Placing New Venice does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 3;
    game.addOcean(player, oceanSpace);
    expect(player.plants).eq(4);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
    // Losing two plants as the rules of the card dictate, not gaining any.
    expect(player.plants).eq(2);
  });

  it('New Venice is compatible with Martian Lumber Corp', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    player.steel = 0;
    player.plants = 2;

    const martianLumberCorp = new MartianLumberCorp();
    addOcean(player);
    addOcean(player);
    addOcean(player);
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.playCard(martianLumberCorp);
    player.megaCredits = card.cost - 3;
    player.plants = 3;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.plants = 2;
    player.steel = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });
});
