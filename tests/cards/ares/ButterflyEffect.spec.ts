import {ButterflyEffect} from '../../../src/server/cards/ares/ButterflyEffect';
import {expect} from 'chai';
import {ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {ShiftAresGlobalParameters} from '../../../src/server/inputs/ShiftAresGlobalParameters';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {runAllActions, cast} from '../../TestingUtils';

describe('ButterflyEffect', function() {
  let card: ButterflyEffect;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ButterflyEffect();
    game = newTestGame(2, ARES_OPTIONS_WITH_HAZARDS);
    player = getTestPlayer(game, 0);
  });

  it('play', function() {
    const priorTerraformingRating = player.getTerraformRating();
    card.play(player);
    expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);

    const originalHazardData = game.aresData!.hazardData;
    expect(originalHazardData.erosionOceanCount.threshold).eq(3);
    expect(originalHazardData.removeDustStormsOceanCount.threshold).eq(6);
    expect(originalHazardData.severeErosionTemperature.threshold).eq(-4);
    expect(originalHazardData.severeDustStormOxygen.threshold).eq(5);

    runAllActions(game);
    const input = cast(player.getWaitingFor(), ShiftAresGlobalParameters);
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
});
