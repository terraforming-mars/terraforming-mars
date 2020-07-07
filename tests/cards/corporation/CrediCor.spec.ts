import { expect } from "chai";
import { CrediCor } from "../../../src/cards/corporation/CrediCor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { StandardProjectType } from "../../../src/StandardProjectType";
import { Bushes } from "../../../src/cards/Bushes";
import { GiantIceAsteroid } from "../../../src/cards/GiantIceAsteroid";

describe("CrediCor", function () {
    let card : CrediCor, player : Player, game : Game;

    beforeEach(function() {
        card = new CrediCor();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);

        card.onStandardProject(player, StandardProjectType.SELLING_PATENTS);
        card.onStandardProject(player, StandardProjectType.GREENERY);
        card.onStandardProject(player, StandardProjectType.CITY);
        expect(player.megaCredits).to.eq(8);
    });

    it("Runs onCardPlayed", function () {
        player.corporationCard = card;
        expect(player.megaCredits).to.eq(0);
        card.onCardPlayed(player, game, new GiantIceAsteroid());
        expect(player.megaCredits).to.eq(4);
        card.onCardPlayed(player, game, new Bushes());
        expect(player.megaCredits).to.eq(4);
    });
});
