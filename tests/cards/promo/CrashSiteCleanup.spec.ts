import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { CrashSiteCleanup } from "../../../src/cards/promo/CrashSiteCleanup";
import { SmallAsteroid } from "../../../src/cards/promo/SmallAsteroid";

describe("CrashSiteCleanup", function () {
    let card : CrashSiteCleanup, player : Player, game : Game;

    beforeEach(function() {
        card = new CrashSiteCleanup();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can play if removed plants from another player this generation", function () {
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player2.plants = 1;
        
        const smallAsteroid = new SmallAsteroid();
        smallAsteroid.play(player, game);
        // Choose Remove 1 plant option
        (game.interrupts[0].playerInput as OrOptions).options[0].cb([player2]);

        expect(card.canPlay(player, game)).to.eq(true);
        expect(game.someoneHasRemovedOtherPlayersPlants).to.eq(true);

        const action = card.play(player, game) as OrOptions;
        action.options[0].cb();
        expect(player.titanium).to.eq(1);
        action.options[1].cb();
        expect(player.steel).to.eq(2);
    });
});
