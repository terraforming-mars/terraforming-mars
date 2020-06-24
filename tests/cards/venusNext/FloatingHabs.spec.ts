import { expect } from "chai";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { ICard } from "../../../src/cards/ICard";
import { Game } from "../../../src/Game";

describe("FloatingHabs", function () {
    it("Should play", function () {
        const card = new FloatingHabs();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act - single target", function () {
        const card = new FloatingHabs();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card);
        player.megaCredits = 10;

        card.action(player, game);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);
    });
    it("Should act - multiple targets", function () {
        const card = new FloatingHabs();
        const card2 = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card2);
        player.megaCredits = 10;
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        (action as SelectCard<ICard>).cb([card]);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);
    });
});