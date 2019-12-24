
import { expect } from "chai";
import { Pets } from "../../src/cards/Pets";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Pets", function () {
    it("Should throw", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        expect(function () { player.removeAnimals(player, card, 5); }).to.throw("Animals may not be removed from pets");
    });
    it("Should play", function () {
        const card = new Pets();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints(player)).to.eq(2);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getResourcesOnCard(card)).to.eq(6);
    });
});
