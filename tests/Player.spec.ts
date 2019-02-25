
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { LunarBeam } from "../src/cards/LunarBeam";
import { Game } from "../src/Game";
import { Insulation } from "../src/cards/Insulation";
import { PowerSupplyConsortium } from "../src/cards/PowerSupplyConsortium";

describe("Player", function () {
    it("should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        expect(player.corporationCard).to.eq(undefined);
    });
    it("Should throw error is nothing to process", function () {
        const player = new Player("test", Color.BLUE, false);
        expect(function() { player.process([]); }).to.throw("Not waiting for anything");
    });
    it("Should run select player for PowerSupplyConsortium", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new LunarBeam());
        player.playedCards.push(new LunarBeam());
        player.energyProduction = 1;
        const action = card.play(player, new Game("foobar", [player], player));
        player.setWaitingFor(action);
        player.process([[player.id]]);
        expect(player.energyProduction).to.eq(1);
    });
    it("Should error with input for run select player for PowerSupplyConsortium", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new LunarBeam());
        player.playedCards.push(new LunarBeam());
        const action = card.play(player, new Game("foobar", [player], player));
        player.setWaitingFor(action);
        expect(player.getWaitingFor()).not.to.eq(undefined);
        expect(function () { player.process([[]]) }).to.throw("Invalid players array provided");
        expect(function () { player.process([]) }).to.throw("Incorrect options provided");
        expect(function () { player.process([["bar"]]) }).to.throw("Player not available");
    });
    it("Should run select amount for ", function () {
        const card = new Insulation();
        const player = new Player("test", Color.BLUE, false);
        player.heatProduction = 2;
        const action = card.play(player, new Game("foobar", [player], player));
        player.setWaitingFor(action);
        expect(player.getWaitingFor()).not.to.eq(undefined);
        expect(function () { player.process([[]]) }).to.throw("Too many amounts provided");
        expect(function () { player.process([]) }).to.throw("Incorrect options provided");
        expect(function () { player.process([["foobar"]]) }).to.throw("Amount is not a number");
        player.process([["1"]]);
        expect(player.heatProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.getWaitingFor()).to.eq(undefined);
    });
});
