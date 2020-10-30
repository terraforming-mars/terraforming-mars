import { CardRequirement } from "../src/cards/CardRequirement";
import { Tags } from "../src/cards/Tags";
import { Resources } from "../src/Resources";
import { PartyName } from "../src/turmoil/parties/PartyName";
import { expect } from "chai";

describe("CardRequirement", function () {
    it("ocean: success", function () {
        expect(CardRequirement.oceans(-1).getLabel()).to.equal("Ocean");
    });
    it("oceans: success", function () {
        expect(CardRequirement.oceans(3).getLabel()).to.equal("3 Oceans");
    });
    it("oceans-max: success", function () {
        expect(CardRequirement.oceans(2).max().getLabel()).to.equal("max 2 Oceans");
    });
    it("ocean-1-max: success", function () {
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
    it("Chairman: success", function(){
        expect(CardRequirement.chairman().getLabel()).to.equal("Chairman")
    });
    it("Cities-singular: success", function(){
        expect(CardRequirement.cities(-1).getLabel()).to.equal("City")
    });
    it("Cities-plural: success", function(){
        expect(CardRequirement.cities(2).getLabel()).to.equal("2 Cities")
    });
    it("Cities-max: success", function(){
        expect(CardRequirement.cities(4).max().getLabel()).to.equal("max 4 Cities")
    });
    it("Colonies-singular: success", function(){
        expect(CardRequirement.colonies(-1).getLabel()).to.equal("Colony")
    });
    it("Colonies-plural: success", function(){
        expect(CardRequirement.colonies(2).getLabel()).to.equal("2 Colonies")
    });
    it("Forest: success", function(){
        expect(CardRequirement.forests(-1).getLabel()).to.equal("Forest")
    });
    it("Forest-max: success", function(){
        expect(CardRequirement.forests(1).max().getLabel()).to.equal("max 1 Forest")
    });
    it("Forests: success", function(){
        expect(CardRequirement.forests(2).getLabel()).to.equal("2 Forests")
    });
    it("Floater: success", function(){
        expect(CardRequirement.floaters(-1).getLabel()).to.equal("Floater")
    });
    it("Floater-max: success", function(){
        expect(CardRequirement.floaters(1).max().getLabel()).to.equal("max 1 Floater")
    });
    it("Floaters: success", function(){
        expect(CardRequirement.floaters(2).getLabel()).to.equal("2 Floaters")
    });
    it("Res type-max: success", function(){
        expect(CardRequirement.resourceTypes(1).max().getLabel()).to.equal("max 1 Resource type")
    });
    it("Res types: success", function(){
        expect(CardRequirement.resourceTypes(9).getLabel()).to.equal("9 Resource types")
    });
    it("Tag-science(2): success", function(){
        expect(CardRequirement.tag(Tags.SCIENCE, 2).getLabel()).to.equal("2 Science")
    });
    it("Tag-science: success", function(){
        expect(CardRequirement.tag(Tags.SCIENCE, -1).getLabel()).to.equal("Science")
    });
    it("Production-steel: success", function(){
        expect(CardRequirement.production(Resources.STEEL, -1).getLabel()).to.equal("Steel production")
    });
    it("Production-titanium: success", function(){
        expect(CardRequirement.production(Resources.TITANIUM, -1).getLabel()).to.equal("Titanium production")
    });
    it("Production-energy(2): success", function(){
        expect(CardRequirement.production(Resources.ENERGY, 2).getLabel()).to.equal("2 Energy production")
    });
    it("Party-mars first: success", function(){
        expect(CardRequirement.party(PartyName.MARS).getLabel()).to.equal("mars first")
    });
    it("Party-reds: success", function(){
        expect(CardRequirement.party(PartyName.REDS).getLabel()).to.equal("reds")
    });
    it("Party-reds: success", function(){
        expect(CardRequirement.partyLeaders(2).getLabel()).to.equal("2 Party leaders")
    });
});
