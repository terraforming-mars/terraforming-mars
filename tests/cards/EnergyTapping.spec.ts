import { expect } from "chai";
import { EnergyTapping } from "../../src/cards/EnergyTapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("EnergyTapping", function () {
    let card : EnergyTapping, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new EnergyTapping();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play - auto select if single target", function () {
        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        const input = game.deferredActions.next()!.execute();
        expect(input).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });

    it("Should play - multiple targets", function () {
        player2.addProduction(Resources.ENERGY, 3);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(game.deferredActions).has.lengthOf(1);
        
        const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
    });

    it("Playable in solo mode", function () {
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        
        player.victoryPointsBreakdown.setVictoryPoints("victoryPoints", card.getVictoryPoints());
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    });
});
