import { expect } from "chai";
import { Luna } from "../../src/colonies/Luna";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";

describe("Luna", function() {
    let luna: Luna, player: Player, player2: Player, game: Game;

    beforeEach(function() {
        luna = new Luna();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
        game.gameOptions.coloniesExtension = true;
        game.colonies.push(luna);
    });

    it("Should build", function() {
        luna.onColonyPlaced(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    });

    it("Should trade", function() {
        luna.trade(player, game);
        expect(player.megaCredits).to.eq(2);
        expect(player2.megaCredits).to.eq(0);
    });

    it("Should give trade bonus", function() {
        luna.onColonyPlaced(player, game);

        luna.trade(player2, game);
        game.deferredActions.runAll(() => {});

        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
        expect(player.megaCredits).to.eq(2);
        expect(player2.megaCredits).to.eq(2);
    });
});
