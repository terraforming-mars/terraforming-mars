import { expect } from "chai";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { SelectCard } from "../../../src/inputs/SelectCard";

describe("Dirigibles", function () {
    let card : Dirigibles, player : Player, game : Game;

    beforeEach(function() {
        card = new Dirigibles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act - single target", function () {
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        player.playedCards.push(new FloatingHabs());
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        
        action!.cb([card]);
        expect(card.resourceCount).to.eq(1);
    });
});