// Simple sanity test for the moment.

import { expect } from "chai";
import { AresHandler } from "../../src/ares/AresHandler";
import { SpaceBonus } from "../../src/SpaceBonus";
import { AresSpaceBonus } from "../../src/ares/AresSpaceBonus";

describe("AresHandler", function () {
    it("NotIsAresSpaceBonus", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.TITANIUM)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.STEEL)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.PLANT)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.DRAW_CARD)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.HEAT)).is.false;
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.OCEAN)).is.false;
    });
    it("IsAresSpaceBonus", function () {
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.ANIMAL)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.MEGACREDITS)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.MICROBE)).is.true;
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.POWER)).is.true;
    });

    // Tests:
    // Get adjacency bonus
    // Adjacency bonus grants player 1MC
    // Pay adjacency costs
    // pay hazard costs
    // Place tile over hazard

});