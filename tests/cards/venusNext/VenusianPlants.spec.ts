import { expect } from "chai";
import { VenusianPlants } from "../../../src/cards/venusNext/VenusianPlants";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Thermophiles } from '../../../src/cards/venusNext/Thermophiles';
import { Game } from '../../../src/Game';
import { VenusianAnimals } from "../../../src/cards/venusNext/VenusianAnimals";

describe("VenusianPlants", function () {
    let card : VenusianPlants, player : Player, game : Game;

    beforeEach(function() {
        card = new VenusianPlants();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 14;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play - multiple targets", function () {
        (game as any).venusScaleLevel = 16;
        expect(card.canPlay(player, game)).to.eq(true);

        const card2 = new Thermophiles();
        const card3 = new VenusianAnimals();
        player.playedCards.push(card2, card3);

        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        
        action!.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(18);
    });

    it("Should play - single target", function () {
        const card2 = new Thermophiles();
        player.playedCards.push(card2);
        (game as any).venusScaleLevel = 16;
        
        card.play(player, game);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(18);
    });
});