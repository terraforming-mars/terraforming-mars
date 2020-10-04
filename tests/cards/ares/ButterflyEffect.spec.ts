import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { ButterflyEffect } from "../../../src/cards/ares/ButterflyEffect";
import { expect } from "chai";
import { ShiftAresGlobalParametersInterrupt } from "../../../src/interrupts/ShiftAresGlobalParametersInterrupt";
import { ARES_OPTIONS_WITH_HAZARDS } from "../../ares/AresTestHelper";

describe("ButterflyEffect", function () {
    let card: ButterflyEffect, player: Player, game: Game;

    beforeEach(function () {
        card = new ButterflyEffect();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player, ARES_OPTIONS_WITH_HAZARDS);
    });

    it("play", function () {
        const priorTerraformingRating = player.getTerraformRating();
        card.play(player, game);
        expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);
        const interrupt = game.interrupts[0];
        expect(interrupt).instanceOf(ShiftAresGlobalParametersInterrupt);

        const originalHazardData = game.aresData!.hazardData;
        expect(originalHazardData.erosionOceanCount.threshold).eq(3);
        expect(originalHazardData.removeDustStormsOceanCount.threshold).eq(6);
        expect(originalHazardData.severeErosionTemperature.threshold).eq(-4);
        expect(originalHazardData.severeDustStormOxygen.threshold).eq(5);

        (interrupt as ShiftAresGlobalParametersInterrupt).playerInput.cb(
            {
                lowOceanDelta: -1,
                highOceanDelta: 1,
                temperatureDelta:  -1,
                oxygenDelta:  1
            }
        );

        const revisedHazardData = game.aresData!.hazardData;
        expect(revisedHazardData.erosionOceanCount.threshold).eq(2);
        expect(revisedHazardData.removeDustStormsOceanCount.threshold).eq(7);
        expect(revisedHazardData.severeErosionTemperature.threshold).eq(-6);
        expect(revisedHazardData.severeDustStormOxygen.threshold).eq(6);

    });
});
