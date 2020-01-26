
import { expect } from "chai";
import { Color } from "../src/Color";
import { Player } from "../src/Player";
import { LunarBeam } from "../src/cards/LunarBeam";
import { Game } from "../src/Game";
import { Insulation } from "../src/cards/Insulation";
import { IoMiningIndustries } from  "../src/cards/IoMiningIndustries";
import { PowerSupplyConsortium } from "../src/cards/PowerSupplyConsortium";
import { SaturnSystems } from "../src/cards/corporation/SaturnSystems";
import { SelectOption } from "../src/inputs/SelectOption";
import { Resources } from '../src/Resources';

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
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        player2.setProduction(Resources.ENERGY,2);
        player3.setProduction(Resources.ENERGY,2);
        player.playedCards.push(new LunarBeam());
        player.playedCards.push(new LunarBeam());
        const action = card.play(player, new Game("foobar", [player, player2, player3], player));
        if (action !== undefined) {
            player.setWaitingFor(action);
            player.process([[player2.id]]);
            expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        }
    });
    it("Should error with input for run select player for PowerSupplyConsortium", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new LunarBeam());
        player.playedCards.push(new LunarBeam());
        const action = card.play(player, new Game("foobar", [player,player], player));
        if (action !== undefined) {
            player.setWaitingFor(action);
            expect(player.getWaitingFor()).not.to.eq(undefined);
            expect(function () { player.process([[]]) }).to.throw("Invalid players array provided");
            expect(function () { player.process([]) }).to.throw("Incorrect options provided");
            expect(function () { player.process([["bar"]]) }).to.throw("Player not available");
        }
    });
    it("Should run select amount for Insulation", function () {
        const card = new Insulation();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.HEAT,2)
        const action = card.play(player, new Game("foobar", [player,player], player));
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;
        player.setWaitingFor(action);
        expect(player.getWaitingFor()).not.to.eq(undefined);
        expect(function () { player.process([[]]) }).to.throw("Incorrect number of amounts provided");
        expect(function () { player.process([]) }).to.throw("Incorrect options provided");
        expect(function () { player.process([["foobar"]]) }).to.throw("Number not provided for amount");
        player.process([["1"]]);
        expect(player.getProduction(Resources.HEAT)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player.getWaitingFor()).to.eq(undefined);
    });
    it("Runs SaturnSystems when other player plays card", function () {
        const player1 = new Player("p1", Color.BLUE, false);
        const player2 = new Player("p2", Color.RED, false);
        const game = new Game("gto", [player1, player2], player1);
        const card = new IoMiningIndustries();
        const corporationCard = new SaturnSystems();
        expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(0);
        player1.corporationCard = corporationCard;
        player2.playCard(game, card, undefined);
        expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
    it("Chains onend functions from player inputs", function (done) {
        const player = new Player("p1", Color.BLUE, false);
        const mockOption3 = new SelectOption("Mock select option 3", () => {
            return undefined;
        });
        const mockOption2 = new SelectOption("Mock select option 2", () => {
            return mockOption3;
        });
        mockOption2.onend = () => {};
        const mockOption = new SelectOption("Mock select option", () => {
            return mockOption2;
        });
        mockOption.onend = () => {
            done();
        };
        player.setWaitingFor(mockOption);
        player.process([["1"]]);
        expect(player.getWaitingFor()).not.to.be.undefined;
        player.process([["1"]]);
        expect(player.getWaitingFor()).not.to.be.undefined;
        player.process([["1"]]);
        expect(player.getWaitingFor()).to.be.undefined;
    });
});
