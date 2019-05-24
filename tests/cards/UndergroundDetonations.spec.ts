
import { expect } from "chai";
import { UndergroundDetonations } from "../../src/cards/UndergroundDetonations";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("UndergroundDetonations", function () {
    it("Should throw", function () {
        const card = new UndergroundDetonations();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new UndergroundDetonations();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new UndergroundDetonations();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.megaCredits = 10;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.heatProduction).to.eq(2);
    });
});
