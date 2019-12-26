
import { expect } from "chai";
import { EnergyTapping } from "../../src/cards/EnergyTapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("EnergyTapping", function () {
    it("Can't be played", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.BLUE, false);

        const game = new Game("foobar", [player, player2], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should throw", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.BLUE, false);
        const player3 = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player2,player3], player);

        player.energyProduction = 0
        player2.energyProduction = 3
        player3.energyProduction = 5

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action === undefined) return;
        expect(function () { action.cb(player); }).to.throw("Selected player has no energy production");
    });
    it("Should play", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("energy_reducting", [player,player2], player);

        player.energyProduction = 2

        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        
        expect(player.energyProduction).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
    });

    it("Asks for target player to reduce Energy production", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("energy_reducting_2", [player,player2, player3], player);

        player.energyProduction = 1
        player2.energyProduction = 3
        player3.energyProduction = 5

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action === undefined) return;
        
        action.cb(player3)
        expect(player.energyProduction).to.eq(2); // increased
        expect(player2.energyProduction).to.eq(3); // not changed
        expect(player3.energyProduction).to.eq(4); // reduced
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
    });
    it("Playable in solo mode", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("energy_reducting", [player], player);

        player.energyProduction = 0

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        
        player.victoryPoints += card.getVictoryPoints();
        expect(player.energyProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(-1);
    });
});
