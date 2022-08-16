import {expect} from 'chai';
import {NoctisCity} from '../../../src/server/cards/base/NoctisCity';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';

describe('NoctisCity', function() {
  let card: NoctisCity;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new NoctisCity();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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
