
import { expect } from "chai";
import { SecurityFleet } from "../../src/cards/SecurityFleet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SecurityFleet", function () {
    it("Can't act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        card.fighterResources = 5;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(5);
    });
    it("Should act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.titanium = 1;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.titanium).to.eq(0);
        expect(card.fighterResources).to.eq(1);
    });
});
