import {Game} from '../../../src/server/Game';
import {NewVenice} from '../../../src/server/cards/pathfinders/NewVenice';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Capital} from '../../../src/server/cards/base/Capital';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {addOcean, cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

// There's a fair bit of code duplication from OceanCity. Rather a lot really.
describe('NewVenice', function() {
  let card: NewVenice;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new NewVenice();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({pathfindersExpansion: true}));
  });

  it('Can play', function() {
    addOcean(player);
    expect(player.simpleCanPlay(card)).is.false;

    addOcean(player);
    expect(player.simpleCanPlay(card)).is.false;

    addOcean(player);
    expect(player.simpleCanPlay(card)).is.false;

    player.plants = 1;
    expect(player.simpleCanPlay(card)).is.false;

    player.plants = 2;
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('play', function() {
    const oceanSpace = addOcean(player);
    player.plants = 2;
    player.production.override({energy: 0, megacredits: 0});

    const action = cast(card.play(player), SelectSpace);

    expect(player.plants).eq(0);
    expect(player.production.megacredits).eq(2);
    expect(player.production.energy).eq(1);
    expect(game.getCitiesOnMarsCount()).eq(0);
    expect(player.game.getCitiesCount(player)).eq(0);

    action.cb(oceanSpace);

    expect(game.getCitiesOnMarsCount()).eq(1);
    expect(player.game.getCitiesCount(player)).eq(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('Cannot place a city next to New Venice', function() {
    const oceanSpace = addOcean(player);

    const action = cast(card.play(player), SelectSpace);

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
    const oceanSpace = addOcean(player);
    player.production.add(Resources.ENERGY, 1);

    const citySpace = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];
    game.addCityTile(player, citySpace.id);

    const action = cast(card.play(player), SelectSpace);

    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it('New Venice counts as ocean for adjacency', function() {
    const oceanSpace = addOcean(player);
    const action = cast(card.play(player), SelectSpace);
    action.cb(oceanSpace);
    const greenery = game.board
      .getAdjacentSpaces(oceanSpace)
      .filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(player.megaCredits).eq(0);

    game.addGreenery(player, greenery.id);

    expect(player.megaCredits).eq(2);
  });

  it('New Venice counts for city-related VP', function() {
    const oceanSpace = addOcean(player);
    const action = cast(card.play(player), SelectSpace);
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
    const capitalAction = cast(capital.play(player), SelectSpace);
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
    const action = cast(card.play(player), SelectSpace);

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

    const action = cast(card.play(player), SelectSpace);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
    // Losing two plants as the rules of the card dictate, not gaining any.
    expect(player.plants).eq(2);
  });
});
