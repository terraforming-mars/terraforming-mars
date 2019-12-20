
import { expect } from "chai";
import { Plantation } from "../../src/cards/Plantation";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { InventorsGuild } from "../../src/cards/InventorsGuild";

describe("Plantation", function () {
    it("Can't play", function () {
        const card = new Plantation();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Plantation();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(new InventorsGuild(), new InventorsGuild());
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
