import { expect } from "chai";
import { SpinInducingAsteroid } from "../../../src/cards/venusNext/SpinInducingAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("SpinInducingAsteroid", function () {
    it("Should play", function () {
        const card = new SpinInducingAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(true);
        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(game.getVenusScaleLevel()).to.eq(4);
    });
});