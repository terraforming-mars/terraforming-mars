
import { expect } from "chai";
import { SpaceElevator } from "../../src/cards/SpaceElevator";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SpaceElevator", function () {
    it("Can't act", function () {
        const card = new SpaceElevator();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SpaceElevator();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(2);
    });
    it("Should act", function () {
        const card = new SpaceElevator();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.steel = 1;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.steel).to.eq(0);
        expect(player.megaCredits).to.eq(5);
    });
});
