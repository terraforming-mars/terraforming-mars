import { expect } from "chai";
import { SpinInducingAsteroid } from "../../../src/cards/venusNext/SpinInducingAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { MorningStarInc } from '../../../src/cards/venusNext/MorningStarInc';

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
    it("Should play with Morning Star", function () {
        const card = new SpinInducingAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.corporationCard = new MorningStarInc();
        game.increaseVenusScaleLevel(player, 2);
        game.increaseVenusScaleLevel(player, 2);
        game.increaseVenusScaleLevel(player, 2);
        expect(game.getVenusScaleLevel()).to.eq(12);
        expect(card.canPlay(player,game)).to.eq(true);
        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(game.getVenusScaleLevel()).to.eq(16);
    });

});