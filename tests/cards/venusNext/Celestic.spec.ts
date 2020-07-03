import { expect } from "chai";
import { Celestic } from "../../../src/cards/venusNext/Celestic";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("Celestic", function () {
    it("Should play", function () {
        const card = new Celestic();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const play = card.play();
        expect(play).to.eq(undefined);

        player.corporationCard = card;

        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});