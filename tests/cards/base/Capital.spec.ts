import {expect} from 'chai';
import {Capital} from '../../../src/cards/base/Capital';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SpaceType} from '../../../src/SpaceType';
import {TileType} from '../../../src/TileType';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {maxOutOceans, TestPlayers} from '../../TestingUtils';
import {Board} from '../../../src/boards/Board';

describe('Capital', function() {
  let card : Capital; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Capital();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    maxOutOceans(player);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if oceans requirement not met', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action instanceof SelectSpace).is.true;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.tile).is.not.undefined;
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CAPITAL);
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(0);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(citySpace.adjacency?.bonus).eq(undefined);
  });

  it('Capital special tile counts as a city', function() {
    const space = game.board.getNthAvailableLandSpace(2, 1, player);
    game.addTile(player, SpaceType.LAND, space, {
      tileType: TileType.CAPITAL,
      card: card.name,
    });

    // cover main functions
    expect(Board.isCitySpace(space)).is.true;
    expect(game.getCitiesInPlayOnMars()).to.eq(1);
    expect(game.getCitiesInPlay()).to.eq(1);

    // check VP
    const greenerySpace = game.board.getAdjacentSpaces(space).find((space) => space.spaceType === SpaceType.LAND);
    game.addGreenery(player, greenerySpace!.id);
    expect(player.getVictoryPoints().city).to.eq(1); // 1 VP for Capital city
  });
});
