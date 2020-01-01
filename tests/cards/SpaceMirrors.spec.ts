
import { expect } from "chai";
import { SpaceMirrors } from "../../src/cards/SpaceMirrors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("SpaceMirrors", function () {
    it("Can't act", function () {
        const card = new SpaceMirrors();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SpaceMirrors();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new SpaceMirrors();
        const player = new Player("test", Color.BLUE, false);
        player.megaCredits = 7;
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    });
});
