import { expect } from "chai";
import { LocalShading } from "../../../src/cards/venusNext/LocalShading";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Resources } from "../../../src/Resources";

describe("LocalShading", function () {
    it("Should play", function () {
        const card = new LocalShading();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new LocalShading();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        card.action(player);
        expect(card.resourceCount).to.eq(1);

        const orOptions = card.action(player) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
