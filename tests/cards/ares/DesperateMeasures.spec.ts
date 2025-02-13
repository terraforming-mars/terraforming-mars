import {expect} from 'chai';
import {DesperateMeasures} from '../../../src/server/cards/ares/DesperateMeasures';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {AresTestHelper} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('DesperateMeasures', () => {
  let card: DesperateMeasures;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DesperateMeasures();
    [game, player] = testGame(2, {aresExtension: true, aresHazards: true});
  });

  it('play on top of dust storm', () => {
    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];

    const priorTr = player.getTerraformRating();

    cast(card.play(player), SelectSpace).cb(protectedDustStorm);

    expect(player.getTerraformRating()).eq(priorTr + 1);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('play on top of erosion tile', () => {
    // 3 oceans brings out the erosion tiles
    addOcean(player);
    addOcean(player);
    addOcean(player);

    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    const protectedErosion = tiles.get(TileType.EROSION_MILD)![0];

    const priorTr = player.getTerraformRating();
    const priorTemp = game.getTemperature();

    cast(card.play(player), SelectSpace).cb(protectedErosion);

    expect(player.getTerraformRating()).eq(priorTr + 1);
    expect(game.getTemperature()).eq(priorTemp + 2);
  });

  it('hazard tile with player marker cannot be played on', () => {
    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];
    player.megaCredits = 8;
    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).contains(protectedDustStorm.id);

    cast(card.play(player), SelectSpace).cb(protectedDustStorm);

    expect(game.board.getAvailableSpacesOnLand(player).map((s) => s.id)).not.contains(protectedDustStorm.id);
  });

  it('hazard tile with player marker is not removed after placing the sixth ocean', () => {
    const tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];
    cast(card.play(player), SelectSpace).cb(protectedDustStorm);

    // The sixth ocean removes dust storms.
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);

    let mildDustStorms = AresTestHelper.byTileType(AresTestHelper.getHazards(player)).get(TileType.DUST_STORM_MILD);
    expect(mildDustStorms).has.length(3);
    addOcean(player);
    mildDustStorms = AresTestHelper.byTileType(AresTestHelper.getHazards(player)).get(TileType.DUST_STORM_MILD);
    expect(mildDustStorms).has.length(1);
    expect(mildDustStorms![0].id).eq(protectedDustStorm.id);
  });
});
