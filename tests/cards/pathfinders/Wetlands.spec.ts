import {IGame} from '../../../src/server/IGame';
import {Wetlands} from '../../../src/server/cards/pathfinders/Wetlands';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {addCity, addGreenery, addOcean, cast, fakeCard, runAllActions, setOxygenLevel, setTemperature, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Space} from '../../../src/server/boards/Space';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '../../../src/common/constants';
import {CardName} from '../../../src/common/cards/CardName';
import {testGame} from '../../TestGame';

const toSpaceId = (space: Space): string => space.id;

describe('Wetlands', function() {
  let card: Wetlands;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Wetlands();
    [game, player/* , player2 */] = testGame( 2, {pathfindersExpansion: true});
    game.board = EmptyBoard.newInstance();
    game.board.getSpaceOrThrow('15').spaceType = SpaceType.OCEAN;
    game.board.getSpaceOrThrow('16').spaceType = SpaceType.OCEAN;
  });

  // Map looks like this
  //
  //     08  09  10
  //   14  15  16  17
  // 21  22  23  24

  // Can only play when two oceans are next to each other and you have 4 plants.
  it('Can play', function() {
    player.megaCredits = card.cost;

    player.plants = 4;
    addOcean(player, '15');
    expect(player.canPlay(card)).is.false;

    addOcean(player, '16');
    expect(player.canPlay(card)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    player.plants = 3;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  // Same test as above, with Red City in the way
  it('Cannot play next to Red City', function() {
    player.megaCredits = card.cost;

    player.plants = 4;
    addOcean(player, '15');
    expect(player.canPlay(card)).is.false;

    addOcean(player, '16');
    expect(player.canPlay(card)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    game.simpleAddTile(player, game.board.getSpaceOrThrow('10'), {tileType: TileType.RED_CITY, card: CardName.RED_CITY});
    expect(player.canPlay(card)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['23']);
  });


  // If only available spaces are reserved, cannot play.
  it('Can play if spots are reserved', function() {
    player.megaCredits = card.cost;

    player.plants = 4;
    addOcean(player, '15');
    expect(player.canPlay(card)).is.false;

    addOcean(player, '16');
    expect(player.canPlay(card)).is.true;

    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    game.board.getSpaceOrThrow('09').spaceType = SpaceType.OCEAN;

    expect(card.canPlay(player)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['23']);

    game.board.getSpaceOrThrow('23').spaceType = SpaceType.OCEAN;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq([]);

    expect(card.canPlay(player)).is.false;
  });

  it('play', function() {
    player.plants = 7;
    addOcean(player, '15');
    addOcean(player, '16');
    expect(card.canPlay(player)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    const action = card.play(player);
    expect(player.plants).eq(3);

    const selectSpace = cast(action, SelectSpace);
    expect(selectSpace.spaces.map(toSpaceId)).deep.eq(['09', '23']);

    expect(game.getOxygenLevel()).eq(0);

    const space = selectSpace.spaces[0];
    selectSpace.cb(space);
    expect(space.tile?.tileType).eq(TileType.WETLANDS);
    runAllActions(game);

    expect(game.getOxygenLevel()).eq(1);
  });

  it('Wetlands does not count toward global parameters', () => {
    const spaces = game.board.getAvailableSpacesOnLand(player);
    // this is an awkward hack, but because this is using emptyboard, no spaces are dedicated for ocean.
    for (let idx = 0; idx <= 8; idx++) {
      addOcean(player, spaces[idx].id);
    }
    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    expect(game.marsIsTerraformed()).is.true;
    spaces[0].tile!.tileType = TileType.WETLANDS;
    expect(game.marsIsTerraformed()).is.false;
  });

  it('Wetlands counts toward ocean requirements', () => {
    const fake = fakeCard({requirements: [{oceans: 3}]});
    addOcean(player, '15');
    addOcean(player, '16');
    expect(player.canPlay(fake)).is.false;
    game.simpleAddTile(player, game.board.getSpaceOrThrow('09'), {tileType: TileType.WETLANDS});
    expect(player.canPlay(fake)).is.true;
  });

  it('Wetlands counts as ocean for adjacency', function() {
    const space = game.board.getSpaceOrThrow('15');
    game.simpleAddTile(player, space, {tileType: TileType.WETLANDS});

    expect(player.megaCredits).eq(0);
    addGreenery(player, '09');
    expect(player.megaCredits).eq(2);
  });

  it('Wetlands counts for city-related VP', function() {
    const space = game.board.getSpaceOrThrow('15');
    game.simpleAddTile(player, space, {tileType: TileType.WETLANDS});

    expect(player.getVictoryPoints().city).eq(0);

    addCity(player, '09');

    expect(player.getVictoryPoints().city).eq(1);
  });

  it('Wetlands works with land claim', function() {
    player.plants = 7;
    addOcean(player, '15');
    addOcean(player, '16');
    const claimedSpace = game.board.getSpaceOrThrow('09');
    claimedSpace.player = player;

    expect(card.canPlay(player)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    const action = card.play(player);
    expect(player.plants).eq(3);

    const selectSpace = cast(action, SelectSpace);
    expect(selectSpace.spaces.map(toSpaceId)).deep.eq(['09', '23']);

    expect(game.getOxygenLevel()).eq(0);

    const space = selectSpace.spaces[0];
    expect(space.id).eq(claimedSpace.id);
    selectSpace.cb(space);
    expect(space.tile?.tileType).eq(TileType.WETLANDS);
  });

  it('canPlay when Reds are in power', () => {
    const [/* game */, player] = testGame(2, {turmoilExtension: true});

    // Card requirements
    player.plants = 4;
    addOcean(player, '15');
    addOcean(player, '16');

    testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
  });
});
