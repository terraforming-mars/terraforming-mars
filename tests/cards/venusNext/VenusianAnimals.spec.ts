import { expect } from "chai";
import { VenusianAnimals } from "../../../src/cards/venusNext/VenusianAnimals";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("VenusianAnimals", function () {
    it("Should play", function () {
        const card = new VenusianAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
        card.play(player);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints(player));
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});