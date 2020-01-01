
import { expect } from "chai";
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";

describe("ResearchCoordination", function () {
    it("Can play", function () {
        const card = new ResearchCoordination();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play", function () {
        const card = new ResearchCoordination();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
});
