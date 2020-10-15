import { CardRequirement } from "../src/cards/CardRequirement";
import { expect } from "chai";

describe("CardRequirement", function () {
    it("oceans: success", function () {
        expect(CardRequirement.oceans(3).getLabel()).to.equal("3 Oceans");
    });
    it("oceans-max: success", function () {
        expect(CardRequirement.oceans(2).max().getLabel()).to.equal("max 2 Oceans");
    });
    it("ocean-max: success", function () {
        expect(CardRequirement.oceans(1).max().getLabel()).to.equal("max 1 Ocean");
    });
    it("oxygen: success", function(){
        expect(CardRequirement.oxygen(3).getLabel()).to.equal("3% O2")
    });
    it("oxygen-max: success", function(){
        expect(CardRequirement.oxygen(10).max().getLabel()).to.equal("max 10% O2")
    });
    it("temperature (+): success", function(){
        expect(CardRequirement.temperature(24).getLabel()).to.equal("24° C")
    });
    it("temperature (0): success", function(){
        expect(CardRequirement.temperature(0).getLabel()).to.equal("0° C")
    });
    it("temperature (-): success", function(){
        expect(CardRequirement.temperature(-10).getLabel()).to.equal("-10° C")
    });
    it("temperature-max: success", function(){
        expect(CardRequirement.temperature(10).max().getLabel()).to.equal("max 10° C")
    });
    it("venus: success", function(){
        expect(CardRequirement.venus(10).getLabel()).to.equal("10% Venus")
    });
    it("venus-max: success", function(){
        expect(CardRequirement.venus(4).max().getLabel()).to.equal("max 4% Venus")
    });
    it("TR: success", function(){
        expect(CardRequirement.tr(25).getLabel()).to.equal("25 TR")
    });
    it("TR-max: success", function(){
        expect(CardRequirement.tr(4).max().getLabel()).to.equal("max 4 TR")
    });
});
