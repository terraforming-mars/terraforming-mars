
import { expect } from "chai";
import { EnergyTapping } from "../../src/cards/EnergyTapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("EnergyTapping", function () {
    it("Can't be played", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.BLUE, false);

        const game = new Game("foobar", [player, player2], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.BLUE, false);
        const player3 = new Player("test", Color.BLUE, false);

        const game = new Game("foobar", [player,player2,player3], player);
        player2.setProduction(Resources.ENERGY,3);
        player3.setProduction(Resources.ENERGY,5);
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Playable in solo mode", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("energy_reducting", [player], player);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    });
});
