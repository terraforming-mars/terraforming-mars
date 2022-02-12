import {expect} from 'chai';
import {NoctisCity} from '../../../src/cards/base/NoctisCity';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceName} from '../../../src/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';
import {newTestGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';

describe('NoctisCity', function() {
  let card : NoctisCity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NoctisCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', function() {
    // With two players, there's no solo setup, so all spaces will be available.
    const game = newTestGame(2, {boardName: BoardName.HELLAS});
    const player = game.getPlayersInGenerationOrder()[0];

    const action = card.play(player);
    expect(action!.availableSpaces).deep.eq(game.board.getAvailableSpacesForCity(player));
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);

    const noctis = game.board.getSpace(SpaceName.NOCTIS_CITY);
    expect(noctis.tile && noctis.tile.tileType).to.eq(TileType.CITY);
  });
});
