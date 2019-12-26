
import { expect } from "chai";
import { Hackers } from "../../src/cards/Hackers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Hackers", function () {
    it("Can't play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        player.megaCreditProduction = 2;
        if (action !== undefined) {
            expect(action instanceof SelectPlayer);
            action.cb(player);
        }
        expect(player.megaCreditProduction).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.energyProduction).to.eq(0);
    });
});
