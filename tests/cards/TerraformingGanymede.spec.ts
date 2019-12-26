
import { expect } from "chai";
import { TerraformingGanymede } from "../../src/cards/TerraformingGanymede";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TerraformingGanymede", function () {
    it("Should play", function () {
        const card = new TerraformingGanymede();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(2);
        player.playedCards.push(card);
        expect(player.terraformRating).to.eq(21);
    });
});
