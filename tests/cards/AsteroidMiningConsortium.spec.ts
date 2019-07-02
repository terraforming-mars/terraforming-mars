
import { expect } from "chai";
import { AsteroidMiningConsortium } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("AsteroidMiningConsortium", function () {
    it("Should throw", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.titaniumProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(action instanceof SelectPlayer).to.eq(true);
        action.cb(player);
        expect(player.titaniumProduction).to.eq(1);
    });
});
