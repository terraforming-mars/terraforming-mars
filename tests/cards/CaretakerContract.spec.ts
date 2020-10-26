import { expect } from "chai";
import { CaretakerContract } from "../../src/cards/CaretakerContract";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("CaretakerContract", function () {
    let card : CaretakerContract, player : Player, game : Game;

    beforeEach(function() {
        card = new CaretakerContract();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play or act", function () {
        expect(card.canPlay(player, game)).is.not.true;
        expect(card.canAct(player, game)).is.not.true;
    });

    it("Should play", function () {
        (game as any).temperature = 0;
        expect(card.canPlay(player, game)).is.true;
    });

    it("Should act", function () {
        player.heat = 8;
        card.action(player, game);
        expect(player.heat).to.eq(0);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
