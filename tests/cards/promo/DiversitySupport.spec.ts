import { expect } from "chai";
import { DiversitySupport } from "../../../src/cards/promo/DiversitySupport";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Ants } from "../../../src/cards/Ants";
import { Fish } from "../../../src/cards/Fish";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";

describe("DiversitySupport", function () {
    let card : DiversitySupport, player : Player, game : Game;

    beforeEach(function() {
        card = new DiversitySupport();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Can play", function () {
        // 3 non-standard resources
        const ants = new Ants();
        const fish = new Fish();
        const dirigibles = new Dirigibles();
        player.playedCards.push(ants, fish, dirigibles);
        dirigibles.resourceCount = 4;
        fish.resourceCount = 3;
        ants.resourceCount = 2;
        expect(card.canPlay(player)).to.eq(false);

        // 6 standard resources
        player.megaCredits = 10;
        player.steel = 2;
        player.titanium = 1;
        player.plants = 4;
        player.energy = 1;
        player.heat = 3;

        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
