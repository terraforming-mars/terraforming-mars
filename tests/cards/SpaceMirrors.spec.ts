import { expect } from "chai";
import { SpaceMirrors } from "../../src/cards/SpaceMirrors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("SpaceMirrors", function () {
    let card : SpaceMirrors, player : Player;

    beforeEach(function() {
        card = new SpaceMirrors();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't act", function () {
        player.megaCredits = 6;
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.megaCredits = 7;
        expect(card.canAct(player)).to.eq(true);

        card.action(player);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    });
});
