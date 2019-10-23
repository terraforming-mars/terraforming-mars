
import { expect } from "chai";
import { AerobrakedAmmoniaAsteroid, Ants } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AerobrakedAmmoniaAsteroid", function () {
    it("Should play", function () {
        const card = new AerobrakedAmmoniaAsteroid();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(player.heatProduction).to.eq(3);
        expect(player.plantProduction).to.eq(1);
        expect(action).not.to.eq(undefined);
        const selectedCard = new Ants();
        player.playedCards.push(selectedCard);
        action.cb([selectedCard]);
        expect(player.getResourcesOnCard(selectedCard)).to.eq(2);
    });
});
