
import { expect } from "chai";
import { ImmigrantCity } from "../../src/cards/ImmigrantCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ImmigrantCity", function () {
    it("Can't play", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(1);
        player.playedCards.push(card);
        game.addCityTile(player, game.getAvailableSpacesOnLand(player)[0].id);
        expect(player.megaCreditProduction).to.eq(2);
    });
});
