
import { expect } from "chai";
import { LargeConvoy } from "../../src/cards/LargeConvoy";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Pets } from "../../src/cards/Pets";

describe("LargeConvoy", function () {
    it("Should play", function () {
        const card = new LargeConvoy();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        const pets = new Pets();
        player.playedCards.push(pets);
        action.cb();
        expect(player.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
        (action as AndOptions).options[0].cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
        ((action as AndOptions).options[1] as OrOptions).options[0].cb();
        expect(player.plants).to.eq(5);
        ((action as AndOptions).options[1] as OrOptions).options[1].cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(4);
    });
});
