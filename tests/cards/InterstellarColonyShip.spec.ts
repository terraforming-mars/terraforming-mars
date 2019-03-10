
import { expect } from "chai";
import { InterstellarColonyShip } from "../../src/cards/InterstellarColonyShip";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { GeneRepair } from "../../src/cards/GeneRepair";

describe("InterstellarColonyShip", function () {
    it("Should throw", function () {
        const card = new InterstellarColonyShip();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 5 science tags.");
    });
    it("Should play", function () {
        const card = new InterstellarColonyShip();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(new GeneRepair(), new GeneRepair(), new GeneRepair(), new GeneRepair(), new GeneRepair());
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(4);
    });
});
