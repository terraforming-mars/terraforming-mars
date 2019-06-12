
import { expect } from "chai";
import { SecurityFleet } from "../../src/cards/SecurityFleet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("SecurityFleet", function () {
    it("Can't act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
        card.fighterResources = 5;
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(5);
    });
    it("Should act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        player.titanium = 1;
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.titanium).to.eq(0);
        expect(card.fighterResources).to.eq(1);
    });
});
