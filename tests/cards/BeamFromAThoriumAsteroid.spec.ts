
import { expect } from "chai";
import { BeamFromAThoriumAsteroid } from "../../src/cards/BeamFromAThoriumAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("BeamFromAThoriumAsteroid", function () {
    it("Should throw", function () {
        const card = new BeamFromAThoriumAsteroid();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BeamFromAThoriumAsteroid();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);
        expect(player.energyProduction).to.eq(3);
    });
});
