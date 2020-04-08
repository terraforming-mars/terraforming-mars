import { expect } from "chai";
import { HiTechLab } from "../../../src/cards/promo/HiTechLab";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectAmount } from "../../../src/inputs/SelectAmount";

describe("HiTechLab", function () {
    it("Should play", function () {
        const card = new HiTechLab();
        expect(card.play()).to.eq(undefined);
    });
    it("Can't act if not energy resources available", function () {
        const card = new HiTechLab();
        const player = new Player("test", Color.BLUE, false);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should act", function () {
        const card = new HiTechLab();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.setResource(Resources.ENERGY, 5);
        expect(card.play()).to.eq(undefined);
        expect(card.canAct(player)).to.eq(true);
        const amount = card.action(player, game) as SelectAmount;
        expect(amount).not.to.eq(undefined);
        expect(amount instanceof SelectAmount).to.eq(true);
        amount.cb(3);
        expect(player.getResource(Resources.ENERGY)).to.eq(2);
    });
    it("Should give victory points", function () {
        const card = new HiTechLab();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play();
        expect(play).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});