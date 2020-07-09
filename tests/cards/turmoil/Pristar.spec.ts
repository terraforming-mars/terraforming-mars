import { expect } from "chai";
import { Pristar } from "../../../src/cards/turmoil/Pristar";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("Pristar", function () {
    it("Should play", function () {
        const card = new Pristar();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const play = card.play(player);
        player.corporationCard = card;
        expect(play).to.eq(undefined);
        player.megaCredits = 10;
        game.increaseTemperature(player,1);
        if (player.corporationCard.onProductionPhase !== undefined) {
            player.corporationCard.onProductionPhase(player);
            expect(player.megaCredits).to.eq(10);
            expect(card.resourceCount).to.eq(0);
        }
    });
});
