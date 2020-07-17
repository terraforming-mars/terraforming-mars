import { expect } from "chai";
import { WaterSplittingPlant } from "../../src/cards/WaterSplittingPlant";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils";

describe("WaterSplittingPlant", function () {
    let card : WaterSplittingPlant, player : Player, game : Game;

    beforeEach(function() {
        card = new WaterSplittingPlant();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can play", function () {
        maxOutOceans(player, game, 2);
        expect(card.canPlay(player, game)).to.eq(true);
    });

    it("Can't act", function () {
        player.energy = 2;
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should act", function () {
        player.energy = 3;
        expect(card.canAct(player, game)).to.eq(true);
        
        card.action(player, game);
        expect(player.energy).to.eq(0);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
