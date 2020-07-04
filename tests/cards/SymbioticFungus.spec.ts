import { expect } from "chai";
import { SymbioticFungus } from "../../src/cards/SymbioticFungus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";
import { Decomposers } from "../../src/cards/Decomposers";

describe("SymbioticFungus", function () {
    let card : SymbioticFungus, player : Player, game : Game;

    beforeEach(function() {
        card = new SymbioticFungus();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -14;
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Should act - single target", function () {
        player.playedCards.push(new Ants());
        card.action(player, game);
        expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        player.playedCards.push(new Ants(), new Decomposers());
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        
        action!.cb([player.playedCards[0]]);
        expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
    });
});
