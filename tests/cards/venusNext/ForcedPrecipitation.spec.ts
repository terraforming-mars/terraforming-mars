import { expect } from "chai";
import { ForcedPrecipitation } from "../../../src/cards/venusNext/ForcedPrecipitation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';

describe("ForcedPrecipitation", function () {
    it("Should play", function () {
        const card = new ForcedPrecipitation();
        expect(card.canPlay()).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new ForcedPrecipitation();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        player.megaCredits = 10;
        const action = card.action(player,game);
        const action2 = card.action(player,game);
        expect(action).to.eq(undefined);
        expect(action2).to.eq(undefined);
        expect(player.megaCredits).to.eq(6);
        expect(player.getResourcesOnCard(card)).to.eq(2);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(card)).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});