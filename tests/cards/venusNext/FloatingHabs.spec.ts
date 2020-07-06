import { expect } from "chai";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { ICard } from "../../../src/cards/ICard";
import { Game } from "../../../src/Game";
import { Research } from "../../../src/cards/Research";

describe("FloatingHabs", function () {
    let card : FloatingHabs, player : Player, game : Game;

    beforeEach(function() {
        card = new FloatingHabs();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act - single target", function () {
        player.playedCards.push(card);
        player.megaCredits = 10;

        card.action(player, game);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);
    });

    it("Should act - multiple targets", function () {
        player.playedCards.push(card, new Dirigibles());
        player.megaCredits = 10;
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        
        (action as SelectCard<ICard>).cb([card]);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);
    });

    it("Gives victory points", function () {
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});