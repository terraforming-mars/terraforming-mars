import { expect } from "chai";
import { TopsoilContract } from "../../../src/cards/promo/TopsoilContract";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Tardigrades } from "../../../src/cards/Tardigrades";
import { Ants } from "../../../src/cards/Ants";
import { Game } from "../../../src/Game";
import { AerobrakedAmmoniaAsteroid } from "../../../src/cards/AerobrakedAmmoniaAsteroid";

describe("TopsoilContract", function () {
    let card : TopsoilContract, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new TopsoilContract();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can play", function () {
        card.play(player);
        expect(player.plants).to.eq(3);
    });

    it("Gives 1 MC whenever player gains a microbe", function () {
        player.playedCards.push(card);

        // Get MC when player gains microbes
        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        tardigrades.action(player);
        expect(player.megaCredits).to.eq(1);

        const aerobrakedAmmoniaAsteroid = new AerobrakedAmmoniaAsteroid();
        aerobrakedAmmoniaAsteroid.play(player, game);
        expect(tardigrades.resourceCount).to.eq(3);
        expect(player.megaCredits).to.eq(3);

        // Don't get MC when other players gain microbes
        const ants = new Ants();
        player2.playedCards.push(ants);
        ants.action(player2, game);
        expect(player.megaCredits).to.eq(3);
    });
});
