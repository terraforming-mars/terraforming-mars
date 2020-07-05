import { expect } from "chai";
import { VenusMagnetizer } from "../../../src/cards/venusNext/VenusMagnetizer";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from "../../../src/Resources";

describe("VenusMagnetizer", function () {
    let card : VenusMagnetizer, player : Player, game : Game;

    beforeEach(function() {
        card = new VenusMagnetizer();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 8;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).venusScaleLevel = 10;
        expect(card.canPlay(player, game)).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });

    it("Should act", function () {
        player.setProduction(Resources.ENERGY,2);
        player.playedCards.push(card);
        
        card.action(player,game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});
