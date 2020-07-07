import { expect } from "chai";
import { ExtremeColdFungus } from "../../src/cards/ExtremeColdFungus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Ants } from "../../src/cards/Ants";

describe("ExtremeColdFungus", function () {
    let card : ExtremeColdFungus, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new ExtremeColdFungus();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play", function () {
        (game as any).temperature = -8;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act - single target", function () {
        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        
        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action!.options.length).to.eq(2);
        
        action!.options[0].cb();
        expect(player.getResourcesOnCard(tardigrades)).to.eq(2);

        action!.options[1].cb();
        expect(player.plants).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        const tardigrades = new Tardigrades();
        const ants = new Ants();
        player.playedCards.push(tardigrades, ants);

        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action!.options.length).to.eq(2);

        action!.options[0].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(2);

        action!.options[0].cb([ants]);
        expect(player.getResourcesOnCard(ants)).to.eq(2);
    });
});
