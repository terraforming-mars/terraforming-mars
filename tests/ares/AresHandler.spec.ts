// Simple sanity test for the moment.

import { expect } from "chai";
import { AresHandler } from '../../src/ares/AresHandler';
import { SpaceBonus } from "../../src/SpaceBonus";
import { AresSpaceBonus } from '../../src/ares/AresSpaceBonus';

describe("Sanity", function () {
    it("IsAresSpaceBonusA", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.TITANIUM)).is.false;
    });
    it("IsAresSpaceBonusB", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.STEEL)).is.false;
    });
    it("IsAresSpaceBonusC", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.PLANT)).is.false;
    });
    it("IsAresSpaceBonusD", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.DRAW_CARD)).is.false;
    });
    it("IsAresSpaceBonusE", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.HEAT)).is.false;
    });
    it("IsAresSpaceBonusF", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.OCEAN)).is.false;
    });
    it("IsAresSpaceBonusX", function () {
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.ANIMAL)).is.true;
    });
    it("IsAresSpaceBonusY", function () {
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.MC)).is.true;
    });
    it("IsAresSpaceBonusB", function () {
        expect(AresHandler.isAresSpaceBonus(AresSpaceBonus.ANIMAL)).is.true;
    });
    it("IsAresSpaceBonusC", function () {
        expect(AresHandler.isAresSpaceBonus(SpaceBonus.TITANIUM)).is.false;
    });

});