import { expect } from "chai";
import { EnergyMarket } from "../../../src/cards/promo/EnergyMarket";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectAmount } from "../../../src/inputs/SelectAmount";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("EnergyMarket", function () {
    it("Should play", function () {
        const card = new EnergyMarket();
        expect(card.play()).to.eq(undefined);
    });
    it("Can't act", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        player.setResource(Resources.MEGACREDITS, 1);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Can act when sufficient MC resources and energy production available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        player.setResource(Resources.MEGACREDITS, 2);
        player.setProduction(Resources.ENERGY, 1);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
    });
    it("Can act when sufficient MC resources available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        player.setResource(Resources.MEGACREDITS, 2);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
    });
    it("Can act when sufficient MC (using heat) resources available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        player.canUseHeatAsMegaCredits = true;
        player.setResource(Resources.MEGACREDITS, 1);
        player.setResource(Resources.HEAT, 3);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
    });
    it("Can act when energy production available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY, 1);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
    });
    it("Should act and provide options when enough MC resources and energy production available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.setResource(Resources.MEGACREDITS, 2);
        player.setProduction(Resources.ENERGY, 1);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
        const result = card.action(player, game);
        expect(result instanceof OrOptions).to.eq(true);
    });
    it("Should act when sufficient MC resources available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.setResource(Resources.MEGACREDITS, 2);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
        const result = card.action(player, game);
        expect(result instanceof SelectAmount).to.eq(true);
    });
    it("Should act when energy production available", function () {
        const card = new EnergyMarket();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.setProduction(Resources.ENERGY, 1);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(0);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
        const result = card.action(player, game);
        expect(result).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
    });
});