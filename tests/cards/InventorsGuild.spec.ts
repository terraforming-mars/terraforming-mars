
import { expect } from "chai";
import { InventorsGuild } from "../../src/cards/InventorsGuild";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("InventorsGuild", function () {
    it("Should play", function () {
        const card = new InventorsGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should throw", function () {
        const card = new InventorsGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(function () { action.options[0].cb([card]); }).to.throw("Can not afford to buy card");
    });
    it("Should act", function () {
        const card = new InventorsGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        player.megaCredits = 3;
        action.options[0].cb([card]);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
        action.options[1].cb();
        expect(game.dealer.discarded.length).to.eq(1);
        expect(player.cardsInHand[0]).to.eq(game.dealer.discarded[0]);
    });
});
