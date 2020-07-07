import { expect } from "chai";
import { NoctisFarming } from "../../src/cards/NoctisFarming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("NoctisFarming", function () {
    let card : NoctisFarming, player : Player, game : Game;

    beforeEach(function() {
        card = new NoctisFarming();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -20;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player.plants).to.eq(2);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
