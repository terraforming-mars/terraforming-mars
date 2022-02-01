import {Game} from '../../../src/Game';
import {NewVenice} from '../../../src/cards/pathfinders/NewVenice';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayers} from '../../TestPlayers';
import {Capital} from '../../../src/cards/base/Capital';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from 'tests/TestPlayer';

// There's a fair bit of code duplication from OceanCity. Rather a lot really.
describe('NewVenice', function() {
  let card: NewVenice;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new NewVenice();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: true}));
  });

  it('Can play', function() {
    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    TestingUtils.addOcean(player);
    expect(card.canPlay(player)).is.false;

    player.plants = 1;
    expect(card.canPlay(player)).is.false;

    player.plants = 2;
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    player.plants = 2;
    player.setProductionForTest({energy: 0, megacredits: 0});

    const action = card.play(player);

    expect(player.plants).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(game.getCitiesOnMarsCount()).eq(0);
    expect(player.game.getCitiesCount(player)).eq(0);

    action.cb(oceanSpace);

    expect(game.getCitiesOnMarsCount()).eq(1);
    expect(player.game.getCitiesCount(player)).eq(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Cannot place a city next to New Venice', function() {
    const oceanSpace = TestingUtils.addOcean(player);

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

  it('Can place New Venice next to a city', function() {
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

  it('New Venice counts as ocean for adjacency', function() {
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

  it('New Venice counts for city-related VP', function() {
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

  it('New Venice counts as VP for Capital', function() {
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
    const action = card.play(player);

    action.cb(oceanSpace);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);

    expect(player.getVictoryPoints().victoryPoints).to.eq(1);
  });

  it('Placing New Venice does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 3;
    game.addOceanTile(player, oceanSpace.id);
    expect(player.plants).eq(4);

    const action = card.play(player);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
    // Losing two plants as the rules of the card dictate, not gaining any.
    expect(player.plants).eq(2);
  });
});
