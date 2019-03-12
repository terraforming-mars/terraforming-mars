
import { expect } from "chai";
import { MirandaResort } from "../../src/cards/MirandaResort";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { BusinessNetwork } from "../../src/cards/BusinessNetwork";

describe("MirandaResort", function () {
    it("Should play", function () {
        const card = new MirandaResort();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(new BusinessNetwork());
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(player.megaCreditProduction).to.eq(1);
    });
});
