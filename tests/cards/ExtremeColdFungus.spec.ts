
import { expect } from "chai";
import { ExtremeColdFungus } from "../../src/cards/ExtremeColdFungus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Ants } from "../../src/cards/Ants";

describe("ExtremeColdFungus", function () {
    it("Can't play", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 2); // -8 
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ExtremeColdFungus();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act - single target", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);

        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        
        const action = card.action(player);
        expect(action).not.to.eq(undefined);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action!.options.length).to.eq(2);
        
        action!.options[1].cb();
        expect(player.getResourcesOnCard(tardigrades)).to.eq(2);
        action!.options[0].cb();
        expect(player.plants).to.eq(1);
    });
    it("Should act - multiple targets", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Ants());
        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        player.addResourceTo(tardigrades, 4);
        const action = card.action(player);
        expect(action).not.to.eq(undefined);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action!.options.length).to.eq(2);
        action!.options[1].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(6);
        action!.options[0].cb();
        expect(player.plants).to.eq(1);
    });
});
