import { expect } from "chai";
import { VenusianAnimals } from "../../../src/cards/venusNext/VenusianAnimals";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Research } from "../../../src/cards/Research";

describe("VenusianAnimals", function () {
    let card : VenusianAnimals, player : Player, game : Game;

    beforeEach(function() {
        card = new VenusianAnimals();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 16;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).venusScaleLevel = 18;
        expect(card.canPlay(player, game)).to.eq(true);
        player.playedCards.push(card);
        card.play();

        card.onCardPlayed(player, game, card);
        expect(player.getResourcesOnCard(card)).to.eq(1);

        card.onCardPlayed(player, game, new Research());
        expect(player.getResourcesOnCard(card)).to.eq(3);

        expect(card.getVictoryPoints()).to.eq(3);
    });
});