
import { expect } from "chai";
import { TectonicStressPower } from "../../src/cards/TectonicStressPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SearchForLife } from "../../src/cards/SearchForLife";

describe("TectonicStressPower", function () {
    it("Should throw", function () {
        const card = new TectonicStressPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 2 science tags");
    });
    it("Should play", function () {
        const card = new TectonicStressPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(new SearchForLife(), new SearchForLife());
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(3);
        expect(player.victoryPoints).to.eq(1);
    });
});
