import {ButterflyEffect} from '../../../src/server/cards/ares/ButterflyEffect';
import {expect} from 'chai';
import {ShiftAresGlobalParameters} from '../../../src/server/inputs/ShiftAresGlobalParameters';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {cast, churnPlay} from '../../TestingUtils';
import {HAZARD_CONSTRAINTS} from '../../../src/common/ares/AresData';
import {AresHandler} from '../../../src/server/ares/AresHandler';

describe('ButterflyEffect', function() {
  let card: ButterflyEffect;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ButterflyEffect();
    [game, player] = testGame(2, {
      aresExtension: true,
      aresHazards: true,
    });
  });

  it('play', function() {
    const priorTerraformingRating = player.getTerraformRating();

    const input = cast(churnPlay(card, player), ShiftAresGlobalParameters);
    expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);

    const originalHazardData = game.aresData!.hazardData;
    expect(originalHazardData.erosionOceanCount.threshold).eq(3);
    expect(originalHazardData.removeDustStormsOceanCount.threshold).eq(6);
    expect(originalHazardData.severeErosionTemperature.threshold).eq(-4);
    expect(originalHazardData.severeDustStormOxygen.threshold).eq(5);

    input.cb(
      {
        lowOceanDelta: -1,
        highOceanDelta: 1,
        temperatureDelta: -1,
        oxygenDelta: 1,
      },
    );

    const revisedHazardData = game.aresData!.hazardData;
    expect(revisedHazardData.erosionOceanCount.threshold).eq(2);
    expect(revisedHazardData.removeDustStormsOceanCount.threshold).eq(7);
    expect(revisedHazardData.severeErosionTemperature.threshold).eq(-6);
    expect(revisedHazardData.severeDustStormOxygen.threshold).eq(6);
  });

  it('do not present input if all global parameters are high enough', () => {
    AresHandler.ifAres(game, (aresData) => {
      for (const constraint of HAZARD_CONSTRAINTS) {
        aresData.hazardData[constraint].available = false;
      }
    });

    const priorTerraformingRating = player.getTerraformRating();

    expect(churnPlay(card, player)).is.undefined;
    expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);
  });
});
