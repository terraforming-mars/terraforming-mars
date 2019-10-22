
import { expect } from "chai";
import { PowerGrid } from "../../src/cards/PowerGrid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PowerGrid", function () {
    it("Should play", function () {
        const card = new PowerGrid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        player.playedCards.push(card);
        card.play(player, game);
        expect(player.energyProduction).to.eq(3);
    });
});
