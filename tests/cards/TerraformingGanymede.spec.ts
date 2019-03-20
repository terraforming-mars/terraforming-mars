
import { expect } from "chai";
import { TerraformingGanymede } from "../../src/cards/TerraformingGanymede";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TerraformingGanymede", function () {
    it("Should play", function () {
        const card = new TerraformingGanymede();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(2);
        player.playedCards.push(card);
        expect(player.terraformRating).to.eq(21);
        card.play(player, game);
        expect(player.terraformRating).to.eq(23);
    });
});
