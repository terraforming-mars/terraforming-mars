import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { ValuableGases } from "../../../src/cards/community/ValuableGases";

describe("ValuableGases", function () {
    let card : ValuableGases, player : Player, game: Game;

    beforeEach(function() {
        card = new ValuableGases();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(player.megaCredits).to.eq(6);
    });
});
