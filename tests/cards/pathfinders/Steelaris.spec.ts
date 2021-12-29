import {expect} from 'chai';
import {Steelaris} from '../../../src/cards/pathfinders/Steelaris';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TileType} from '../../../src//TileType';
import {TestingUtils} from '../../TestingUtils';
import {EmptyBoard} from '../../ares/EmptyBoard';

describe('Steelaris', function() {
  let card: Steelaris;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Steelaris();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.corporationCard = card;
    game.board = EmptyBoard.newInstance();
  });

  it('when you place a city', function() {
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addCityTile(player, citySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
  });

  it('when opponent places a city', function() {
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addCityTile(player2, citySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
  });

  it('when you place a greenery', function() {
    const greenerySpace = game.board.getAvailableSpacesForGreenery(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addGreenery(player, greenerySpace.id);
    TestingUtils.runAllActions(game);

    expect(player.plants).eq(0);
    expect(player.steel).eq(0);
  });

  it('when you place a special tile', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addTile(player, space.spaceType, space, {tileType: TileType.NUCLEAR_ZONE});
    TestingUtils.runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
    expect(player2.plants).eq(0);
    expect(player2.steel).eq(0);
  });

  it('when opponent places a special tile', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addTile(player2, space.spaceType, space, {tileType: TileType.NUCLEAR_ZONE});
    TestingUtils.runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
    expect(player2.plants).eq(0);
    expect(player2.steel).eq(0);
  });
});
