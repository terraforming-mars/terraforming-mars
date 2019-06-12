
import { expect } from "chai";
import { Fish } from "../../src/cards/Fish";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Fish", function () {
    it("Can't play", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new Fish();
        card.action();
        expect(card.animals).to.eq(1);
    });
    it("Should play", function () {
        const card = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        player.plantProduction = 1;
        action.cb(player);
        expect(player.plantProduction).to.eq(0);
        card.animals = 5;
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(card.animals);
    });
});
