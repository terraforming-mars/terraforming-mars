import { expect } from "chai";
import { ExtractorBalloons } from "../../../src/cards/venusNext/ExtractorBalloons";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";

describe("ExtractorBalloons", function () {
    it("Should play", function () {
        const card = new ExtractorBalloons();
        const player = new Player("test", Color.BLUE, false);

        const action = card.play(player);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new ExtractorBalloons();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play(player);
        expect(player.getResourcesOnCard(card)).to.eq(3);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(card)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});