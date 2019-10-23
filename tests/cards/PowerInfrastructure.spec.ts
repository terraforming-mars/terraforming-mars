
import { expect } from "chai";
import { PowerInfrastructure } from "../../src/cards/PowerInfrastructure";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PowerInfrastructure", function () {
    it("Should play", function () {
        const card = new PowerInfrastructure();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.play(player, game)).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new PowerInfrastructure();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energy = 1;
        const action = card.action(player, game);
        action.cb(1);
        expect(player.energy).to.eq(0);
        expect(player.megaCredits).to.eq(1);
    });
});
