
import { expect } from "chai";
import { GanymedeColony } from "../../src/cards/GanymedeColony";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GanymedeColony", function () {
    it("Should play", function () {
        const card = new GanymedeColony();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        player.playedCards.push(card);
        expect(card.getVictoryPoints(player)).to.eq(1);
    });
});
