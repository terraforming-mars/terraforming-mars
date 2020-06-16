
import { expect } from "chai";
import { RegolithEaters } from "../../src/cards/RegolithEaters";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("RegolithEaters", function () {
    it("Should act", function () {
        const card = new RegolithEaters();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new RegolithEaters();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        card.action(player, game);
        expect(card.resourceCount).to.eq(2);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(3);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
