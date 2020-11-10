import { expect } from "chai";
import { KelpFarming } from "../../src/cards/KelpFarming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";
import { maxOutOceans } from "../TestingUtils";

describe("KelpFarming", function () {
    let card : KelpFarming, player : Player, game : Game;

    beforeEach(function() {
        card = new KelpFarming();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        maxOutOceans(player, game, 6);
        expect(card.canPlay(player, game)).is.true;

        const plantsCount = player.plants;
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(3);
        expect(player.plants).to.eq(plantsCount + 2);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
