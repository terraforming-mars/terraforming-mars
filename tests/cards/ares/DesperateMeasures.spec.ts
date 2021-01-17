import {expect} from 'chai';
import {DesperateMeasures} from '../../../src/cards/ares/DesperateMeasures';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {AresTestHelper, ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('DesperateMeasures', function() {
  let card : DesperateMeasures; let player : Player; let game : Game;

  beforeEach(function() {
    card = new DesperateMeasures();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
  });

  it('play on top of dust storm', function() {
    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];

    const priorTr = player.getTerraformRating();

    card.play(player).cb(protectedDustStorm);

    expect(player.getTerraformRating()).eq(priorTr + 1);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('play on top of erosion tile', function() {
    // 3 oceans brings out the erosion tiles
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    const protectedErosion = tiles.get(TileType.EROSION_MILD)![0];

    const priorTr = player.getTerraformRating();
    const priorTemp = game.getTemperature();

    card.play(player).cb(protectedErosion);

    expect(player.getTerraformRating()).eq(priorTr + 1);
    expect(game.getTemperature()).eq(priorTemp + 2);
  });

  it('hazard tile with player marker can\'t be played on', function() {
    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];
    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).contains(protectedDustStorm.id);

    card.play(player).cb(protectedDustStorm);

    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).not.contains(protectedDustStorm.id);
  });
});
