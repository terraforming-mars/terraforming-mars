import { expect } from "chai";
import { CometForVenus } from "../../../src/cards/venusNext/CometForVenus";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';

describe("CometForVenus", function () {
    it("Should play", function () {
        const card = new CometForVenus();
        const card2 = new AerialMappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        player2.megaCredits = 10;
        player2.playedCards.push(card2);

        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(game.getVenusScaleLevel()).to.eq(2);
        expect(player2.megaCredits).to.eq(6);
    });
});