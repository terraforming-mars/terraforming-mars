import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { CrashSiteCleanup } from "../../../src/cards/promo/CrashSiteCleanup";
import { SmallAsteroid } from "../../../src/cards/promo/SmallAsteroid";

describe("CrashSiteCleanup", function () {
    it("Can't play", function () {
        const player = new Player("test", Color.BLUE, false);
        const card = new CrashSiteCleanup();
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Can play if removed plants from another player this generation", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        const card = new CrashSiteCleanup();
        player2.plants = 1;
        
        const smallAsteroid = new SmallAsteroid();
        smallAsteroid.play(player, game);

        expect(card.canPlay(player)).to.eq(true);
        expect(player.hasRemovedOtherPlayersPlants).to.eq(true);

        const action = card.play(player) as OrOptions;
        action.options[0].cb();
        expect(player.titanium).to.eq(1);
        action.options[1].cb();
        expect(player.steel).to.eq(2);
    });
});
