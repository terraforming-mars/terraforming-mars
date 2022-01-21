import {Game} from '../../../src/Game';
import {Wetlands} from '../../../src/cards/pathfinders/Wetlands';
import {expect} from 'chai';
// import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/SpaceType';
import {TestPlayers} from '../../TestPlayers';
// import {Capital} from '../../../src/cards/base/Capital';
// import {SpaceBonus} from '../../../src/SpaceBonus';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {ISpace} from '../../../src/boards/ISpace';

const toSpaceId = (space: ISpace): string => space.id;

describe('Wetlands', function() {
  let card: Wetlands;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Wetlands();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: true}));
    game.board = EmptyBoard.newInstance();
    game.board.getSpace('15').spaceType = SpaceType.OCEAN;
    game.board.getSpace('16').spaceType = SpaceType.OCEAN;
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
    game.addOceanTile(player, '15');
    expect(player.canPlay(card)).is.false;

    game.addOceanTile(player, '16');
    expect(player.canPlay(card)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    player.plants = 3;
    expect(card.canPlay(player)).is.false;
  });

  // If only available spaces are reserved, cannot play.
  it('Can play if spots are reserved', function() {
    player.megaCredits = card.cost;

    player.plants = 4;
    game.addOceanTile(player, '15');
    expect(player.canPlay(card)).is.false;

    game.addOceanTile(player, '16');
    expect(player.canPlay(card)).is.true;

    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    game.board.getSpace('09').spaceType = SpaceType.OCEAN;

    expect(card.canPlay(player)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['23']);

    game.board.getSpace('23').spaceType = SpaceType.OCEAN;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq([]);

    expect(card.canPlay(player)).is.false;
  });

  it('play', function() {
    player.plants = 7;
    game.addOceanTile(player, '15');
    game.addOceanTile(player, '16');
    expect(card.canPlay(player)).is.true;
    expect(card.availableSpaces(player).map(toSpaceId)).deep.eq(['09', '23']);

    const action = card.play(player);
    expect(player.plants).eq(3);

    const selectSpace = TestingUtils.cast(action, SelectSpace);
    expect(selectSpace.availableSpaces.map(toSpaceId)).deep.eq(['09', '23']);

    const space = selectSpace.availableSpaces[0];
    selectSpace.cb(space);
    expect(space.tile?.tileType).eq(TileType.WETLANDS);
  });

  it('Wetlands does not count toward global parameters', () => {
  });

  it('Wetlands counts toward ocean requirements', () => {
  });

  it('Wetlands counts as ocean for adjacency', function() {
    const space = game.board.getSpace('15');
    game.simpleAddTile(player, space, {tileType: TileType.WETLANDS});

    expect(player.megaCredits).eq(0);
    game.addGreenery(player, '09');
    expect(player.megaCredits).eq(2);
  });

  it('Wetlands counts for city-related VP', function() {
    const space = game.board.getSpace('15');
    game.simpleAddTile(player, space, {tileType: TileType.WETLANDS});

    expect(player.getVictoryPoints().city).eq(0);

    game.addCityTile(player, '09');

    expect(player.getVictoryPoints().city).eq(1);
  });
});
