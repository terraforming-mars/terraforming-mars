import { expect } from "chai";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';

describe("FloatingHabs", function () {
    it("Should play", function () {
        const card = new FloatingHabs();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new FloatingHabs();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        player.megaCredits = 10;
        const action = card.action(player);
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([card]);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);
    });
});