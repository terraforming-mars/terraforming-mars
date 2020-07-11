import { expect } from "chai";
import { Advertising } from "../../../src/cards/promo/Advertising";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { EarthCatapult } from "../../../src/cards/EarthCatapult";
import { Resources } from "../../../src/Resources";
import { Game } from "../../../src/Game";

describe("Advertising", function () {
    it("Should play", function () {
        const advertising = new Advertising();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        player.playedCards.push(advertising);
        advertising.play();
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);

        const card = new EarthCatapult();
        card.play();
        advertising.onCardPlayed(player, game, card);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
