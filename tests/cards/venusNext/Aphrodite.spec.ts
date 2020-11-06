import { expect } from "chai";
import { Aphrodite } from "../../../src/cards/venusNext/Aphrodite";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("Aphrodite", function () {
    it("Should play", function () {
        const card = new Aphrodite();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        player.corporationCard = card;
        expect(player.megaCredits).to.eq(0);
        game.increaseVenusScaleLevel(player2,2);
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(player.megaCredits).to.eq(4);
    });
});