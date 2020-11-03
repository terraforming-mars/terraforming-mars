import { setup } from "../utils/Vue";

setup();

import { expect } from "chai";
import { ShiftAresGlobalParameters } from "../../src/components/ShiftAresGlobalParameters";
import { PlayerInputModel } from "../../src/models/PlayerInputModel";
import { PlayerInputTypes } from "../../src/PlayerInputTypes";

describe("ShiftAresGlobalParameters", function () {
    const mockPlayerModel: PlayerInputModel = {
        title: "Testing, baby!",
        buttonLabel: "Click me!",
        inputType: PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS,
        amount: undefined,
        options: undefined,
        cards: undefined,
        maxCardsToSelect: undefined,
        minCardsToSelect: undefined,
        canUseSteel: undefined,
        canUseTitanium: undefined,
        canUseHeat: undefined,
        players: undefined,
        availableSpaces: undefined,
        max: undefined,
        microbes: undefined,
        floaters: undefined,
        coloniesModel: undefined,
        payProduction: undefined,
        aresData: {
            active: true,
            includeHazards: true,
            hazardData: {
                erosionOceanCount: {
                    threshold: 3,
                    available: true,
                },
                removeDustStormsOceanCount: {
                    threshold: 6,
                    available: true,
                },
                severeErosionTemperature: {
                    threshold: -4,
                    available: true,
                },
                severeDustStormOxygen: {
                    threshold: 5,
                    available: true,
                },
            },
            milestoneResults: [],
        },
    };
    it("sets up data", function () {
        const playerinput: PlayerInputModel = mockPlayerModel;
        expect(
            (ShiftAresGlobalParameters as any).data.call({
                playerinput,
            })
        ).to.deep.eq({
            hazardData: {
                erosionOceanCount: { threshold: 3, available: true },
                removeDustStormsOceanCount: { threshold: 6, available: true },
                severeErosionTemperature: { threshold: -4, available: true },
                severeDustStormOxygen: { threshold: 5, available: true },
            },
            lowOceanDelta: 0,
            highOceanDelta: 0,
            temperatureDelta: 0,
            oxygenDelta: 0,
            ADJUSTMENT_RANGE: [-1, 0, 1],
        });
    });
});
