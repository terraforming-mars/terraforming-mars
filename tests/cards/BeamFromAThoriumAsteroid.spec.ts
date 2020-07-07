import { expect } from "chai";
import { BeamFromAThoriumAsteroid } from "../../src/cards/BeamFromAThoriumAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("BeamFromAThoriumAsteroid", function () {
    let card : BeamFromAThoriumAsteroid, player : Player;

    beforeEach(function() {
        card = new BeamFromAThoriumAsteroid();
        player = new Player("test", Color.BLUE, false);
    });

    it("Cannot play without a Jovian tag", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(card);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
