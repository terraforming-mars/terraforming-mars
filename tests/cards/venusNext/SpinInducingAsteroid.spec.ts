import { expect } from "chai";
import { SpinInducingAsteroid } from "../../../src/cards/venusNext/SpinInducingAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { MorningStarInc } from '../../../src/cards/venusNext/MorningStarInc';

describe("SpinInducingAsteroid", function () {
    let card : SpinInducingAsteroid, player : Player, game : Game;

    beforeEach(function() {
        card = new SpinInducingAsteroid();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player,game)).to.eq(true);
        card.play(player, game);
        expect(game.getVenusScaleLevel()).to.eq(4);
    });

    it("Should play with Morning Star", function () {
        player.corporationCard = new MorningStarInc();
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player,game)).to.eq(true);

        card.play(player, game);
        expect(game.getVenusScaleLevel()).to.eq(16);
    });
});