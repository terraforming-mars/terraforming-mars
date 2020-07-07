import { expect } from "chai";
import { Windmills } from "../../src/cards/Windmills";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Windmills", function () {
    let card : Windmills, player : Player, game : Game;

    beforeEach(function() {
        card = new Windmills();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).oxygenLevel = 6;
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        (game as any).oxygenLevel = 7;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
