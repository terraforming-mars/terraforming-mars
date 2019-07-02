
import { expect } from "chai";
import { AdvancedEcosystems } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Pets } from "../../src/cards/Pets";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { TundraFarming } from "../../src/cards/TundraFarming";

describe("AdvancedEcosystems", function () {
    it("Should throw on unmet tag requirements", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires a plant tag, a microbe tag, and an animal tag");
    });
    it("Should play", function () {
        const card = new AdvancedEcosystems();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(new Tardigrades(), new TundraFarming, new Pets());
        card.play(player, game);
        expect(player.victoryPoints).to.eq(3);
    });
});
