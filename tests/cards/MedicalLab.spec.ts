
import { expect } from "chai";
import { MedicalLab } from "../../src/cards/MedicalLab";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Capital } from "../../src/cards/Capital";

describe("MedicalLab", function () {
    it("Should play", function () {
        const card = new MedicalLab();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(0);
        player.playedCards.push(new Capital());
        card.play(player, game);
        expect(player.megaCreditProduction).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
