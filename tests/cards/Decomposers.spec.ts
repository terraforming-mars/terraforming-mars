import { expect } from "chai";
import { Decomposers } from "../../src/cards/Decomposers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Algae } from "../../src/cards/Algae";
import { Birds } from "../../src/cards/Birds";

describe("Decomposers", function () {
    let card : Decomposers, player : Player, game : Game;

    beforeEach(function() {
        card = new Decomposers();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 3;
        expect(card.canPlay(player, game)).to.eq(true);
        card.play();

        card.onCardPlayed(player, game, new Birds());
        expect(card.resourceCount).to.eq(1);
        card.onCardPlayed(player, game, card);
        expect(card.resourceCount).to.eq(2);
        card.onCardPlayed(player, game, new Algae());
        
        expect(card.resourceCount).to.eq(3);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
