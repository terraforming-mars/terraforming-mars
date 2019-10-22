
import { expect } from "chai";
import { NitrogenRichAsteroid } from "../../src/cards/NitrogenRichAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";

describe("NitrogenRichAsteroid", function () {
    it("Should play", function () {
        const card = new NitrogenRichAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.terraformRating).to.eq(23);
        expect(game.getTemperature()).to.eq(-28);
        expect(player.plantProduction).to.eq(1);
        player.playedCards.push(new Bushes(), new Bushes(), new Bushes());
        card.play(player, game);
        expect(player.terraformRating).to.eq(26);
        expect(game.getTemperature()).to.eq(-26);
        expect(player.plantProduction).to.eq(5);
    });
});
