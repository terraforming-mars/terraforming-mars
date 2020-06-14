import { expect } from "chai";
import { VenusianPlants } from "../../../src/cards/venusNext/VenusianPlants";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Thermophiles } from '../../../src/cards/venusNext/Thermophiles';
import { Game } from '../../../src/Game';
import { VenusianAnimals } from "../../../src/cards/venusNext/VenusianAnimals";

describe("VenusianPlants", function () {
    it("Should play - multiple targets", function () {
        const card = new VenusianPlants();
        const card2 = new Thermophiles();
        const card3 = new VenusianAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        player.playedCards.push(card2, card3);

        expect(card.canPlay(player,game)).to.eq(false);
        (game as any).venusScaleLevel = 16; // set min. requirement
        expect(card.canPlay(player,game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        if ( ! (action instanceof SelectCard)) return;
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(18);
    });
    it("Should play - single target", function () {
        const card = new VenusianPlants();
        const card2 = new Thermophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        expect(card.canPlay(player,game)).to.eq(false);
        (game as any).venusScaleLevel = 16; // set min. requirement
        expect(card.canPlay(player,game)).to.eq(true);

        player.playedCards.push(card2);
        card.play(player, game);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(18);
    });
});