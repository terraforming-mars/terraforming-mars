import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {OceanCity} from '../../../src/cards/ares/OceanCity';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {SpaceType} from '../../../src/SpaceType';
import {TestPlayers} from '../../TestPlayers';
import {Capital} from '../../../src/cards/base/Capital';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TestingUtils} from '../../TestingUtils';

describe('OceanCity', function() {
  let card: OceanCity; let player: Player; let game: Game;

  beforeEach(function() {
    card = new OceanCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can play', function() {
    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    player.addProduction(Resources.ENERGY, 1);

    const action = card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
    expect(game.getCitiesInPlayOnMars()).eq(0);
    expect(player.getCitiesCount()).eq(0);

    action.cb(oceanSpace);

    expect(game.getCitiesInPlayOnMars()).eq(1);
    expect(player.getCitiesCount()).eq(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Cannot place a city next to Ocean City', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    player.addProduction(Resources.ENERGY, 1);

    const action = card.play(player);

    action.cb(oceanSpace);

    const adjacentSpaces = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)
      .map((space) => space.id);
    const citySpaces = game.board
      .getAvailableSpacesForCity(player)
      .map((space) => space.id);
    expect(citySpaces).to.not.include.any.members(adjacentSpaces);
  });

  it('Can place Ocean City next to a city', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    player.addProduction(Resources.ENERGY, 1);

    const citySpace = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];
    game.addCityTile(player, citySpace.id);

    const action = card.play(player);

    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  // Add a test where cards that get points for adjacent oceans get credit
  it('', function() {});

  it('Ocean City counts as ocean for adjacency', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);
    action.cb(oceanSpace);
    const greenery = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(player.megaCredits).eq(0);

    game.addGreenery(player, greenery.id);

    expect(player.megaCredits).eq(2);
  });

  it('Ocean City counts for city-related VP', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);
    action.cb(oceanSpace);
    const greenery = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(player.getVictoryPoints().city).eq(0);

    game.addGreenery(player, greenery.id);

    expect(player.getVictoryPoints().city).eq(1);
  });

  it('Ocean City counts as VP for Capital', function() {
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];

    const capital = new Capital();
    const capitalAction = capital.play(player);
    player.playedCards = [capital];

    const capitalSpace = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];
    capitalAction.cb(capitalSpace);

    // In a real game Capital couldn't be placed without an ocean on the board, but this test
    // works around that to guarantee zero points.
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);

    // And now adds the tile.
    game.addOceanTile(player, oceanSpace.id);
    const oceanCityAction = card.play(player);

    oceanCityAction.cb(oceanSpace);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);

    expect(player.getVictoryPoints().victoryPoints).to.eq(1);
  });

  it('Placing Ocean City does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 0;
    game.addOceanTile(player, oceanSpace.id);
    expect(player.plants).eq(1);

    const action = card.play(player);

    expect(player.plants).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
    expect(player.plants).eq(1);
  });
});
