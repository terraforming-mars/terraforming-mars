
import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { LavaFlows } from "../../../src/cards/LavaFlows";
import { Vitor } from "../../../src/cards/prelude/Vitor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { ORIGINAL_AWARDS } from "../../../src/awards/Awards";

describe("Vitor", function () {
    it("Should play", function () {
        const card = new Vitor();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
    });
    it("Has initial action", function () {
        const card = new Vitor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.initialAction(player, game);
        expect(action).to.eq(undefined);
        const game2 = new Game("goobar", [player, player], player);
        const action2 = card.initialAction(player, game2);
        expect(action2 instanceof OrOptions).to.eq(true);
        (action2 as OrOptions).options[0].cb();
        expect(game2.hasBeenFunded(ORIGINAL_AWARDS[0])).to.eq(true);
    });
    it("Give mega credits when card played", function () {
        const lava = new LavaFlows();
        const ants = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const card = new Vitor();
        card.onCardPlayed(player, game, ants);
        expect(player.megaCredits).to.eq(3);
        card.onCardPlayed(player, game, lava);
        expect(player.megaCredits).to.eq(3);
    });
});
