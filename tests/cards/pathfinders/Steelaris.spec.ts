import {expect} from 'chai';
import {Steelaris} from '../../../src/server/cards/pathfinders/Steelaris';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {runAllActions} from '../../TestingUtils';
import {EmptyBoard} from '../../ares/EmptyBoard';

describe('Steelaris', function() {
  let card: Steelaris;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Steelaris();
    [game, player, player2] = testGame(2);
    player.corporations.push(card);
    game.board = EmptyBoard.newInstance();
  });

  it('when you place a city', function() {
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addCity(player, citySpace);
    runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
  });

  it('when opponent places a city', function() {
    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addCity(player2, citySpace);
    runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
  });

  it('when you place a greenery', function() {
    const greenerySpace = game.board.getAvailableSpacesForGreenery(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addGreenery(player, greenerySpace);
    runAllActions(game);

    expect(player.plants).eq(0);
    expect(player.steel).eq(0);
  });

  it('when you place a special tile', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addTile(player, space, {tileType: TileType.NUCLEAR_ZONE});
    runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
    expect(player2.plants).eq(0);
    expect(player2.steel).eq(0);
  });

  it('when opponent places a special tile', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    expect(player.plants).eq(0);
    expect(player.steel).eq(0);

    game.addTile(player2, space, {tileType: TileType.NUCLEAR_ZONE});
    runAllActions(game);

    expect(player.plants).eq(1);
    expect(player.steel).eq(1);
    expect(player2.plants).eq(0);
    expect(player2.steel).eq(0);
  });
});
