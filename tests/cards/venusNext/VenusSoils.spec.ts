import { expect } from "chai";
import { VenusSoils } from "../../../src/cards/venusNext/VenusSoils";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Game } from '../../../src/Game';
import { Thermophiles } from '../../../src/cards/venusNext/Thermophiles';
import { VenusianInsects } from "../../../src/cards/venusNext/VenusianInsects";

describe("VenusSoils", function () {
    it("Should play - single target", function () {
        const card = new VenusSoils();
        const card2 = new Thermophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        player.playedCards.push(card2);
        card.play(player,game);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
    it("Should play - multiple targets", function () {
        const card = new VenusSoils();
        const card2 = new Thermophiles();
        const card3 = new VenusianInsects();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        player.playedCards.push(card2, card3);
        const action = card.play(player,game);
        expect(action instanceof SelectCard).to.eq(true);
        if ( ! (action instanceof SelectCard)) return;
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});