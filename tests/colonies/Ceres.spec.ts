import { expect } from "chai";
import { Ceres } from "../../src/colonies/Ceres";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";

describe("Ceres", function() {
    let ceres: Ceres, player: Player, player2: Player, game: Game;

    beforeEach(function() {
        ceres = new Ceres();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
        game.gameOptions.coloniesExtension = true;
        game.colonies.push(ceres);
    });

    it("Should build", function() {
        ceres.onColonyPlaced(player, game);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player2.getProduction(Resources.STEEL)).to.eq(0);
    });

    it("Should trade", function() {
        ceres.trade(player, game);
        expect(player.steel).to.eq(2);
        expect(player2.steel).to.eq(0);
    });

    it("Should give trade bonus", function() {
        ceres.onColonyPlaced(player, game);

        ceres.trade(player2, game);
        game.deferredActions.runAll(() => {});

        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player2.getProduction(Resources.STEEL)).to.eq(0);
        expect(player.steel).to.eq(2);
        expect(player2.steel).to.eq(2);
    });
});
