
import { expect } from "chai";
import { CaretakerContract } from "../../src/cards/CaretakerContract";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("CaretakerContract", function () {
    it("Can't play or act", function () {
        const card = new CaretakerContract();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () { 
        const card = new CaretakerContract();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new CaretakerContract();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.heat = 8;
        card.action(player, game);
        expect(player.heat).to.eq(0);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
