import { expect } from "chai";
import { Plantation } from "../../src/cards/Plantation";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { InventorsGuild } from "../../src/cards/InventorsGuild";

describe("Plantation", function () {
    let card : Plantation, player : Player, game : Game;

    beforeEach(function() {
        card = new Plantation();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new InventorsGuild(), new InventorsGuild());
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
