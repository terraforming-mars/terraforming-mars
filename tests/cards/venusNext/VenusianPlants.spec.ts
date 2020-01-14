import { expect } from "chai";
import { VenusianPlants } from "../../../src/cards/venusNext/VenusianPlants";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Thermophiles } from '../../../src/cards/venusNext/Thermophiles';
import { Game } from '../../../src/Game';

describe("VenusianPlants", function () {
    it("Should play", function () {
        const card = new VenusianPlants();
        const card2 = new Thermophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
        player.playedCards.push(card2);
        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        if ( ! (action instanceof SelectCard)) return;
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});