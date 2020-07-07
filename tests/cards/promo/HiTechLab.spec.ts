import { expect } from "chai";
import { HiTechLab } from "../../../src/cards/promo/HiTechLab";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectAmount } from "../../../src/inputs/SelectAmount";

describe("HiTechLab", function () {
    let card : HiTechLab, player : Player, game : Game;

    beforeEach(function() {
        card = new HiTechLab();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't act if no energy resources available", function () {
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.setResource(Resources.ENERGY, 5);
        expect(card.canAct(player)).to.eq(true);

        const amount = card.action(player, game) as SelectAmount;
        expect(amount instanceof SelectAmount).to.eq(true);
        
        amount!.cb(3);
        expect(player.getResource(Resources.ENERGY)).to.eq(2);
    });

    it("Should give victory points", function () {
        card.play();
        expect(card.getVictoryPoints()).to.eq(1);
    });
});