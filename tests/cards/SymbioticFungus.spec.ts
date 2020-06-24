
import { expect } from "chai";
import { SymbioticFungus } from "../../src/cards/SymbioticFungus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";
import { Decomposers } from "../../src/cards/Decomposers";

describe("SymbioticFungus", function () {
    it("Can't act or play", function () {
        const card = new SymbioticFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SymbioticFungus();
        expect(card.play()).to.eq(undefined);
    });
    it("Should act - single target", function () {
        const card = new SymbioticFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(new Ants());
        card.action(player, game);
        expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
    });
    it("Should act - multiple targets", function () {
        const card = new SymbioticFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(new Ants());
        player.playedCards.push(new Decomposers());
        
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        action!.cb([player.playedCards[0]]);
        expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
    });
});
