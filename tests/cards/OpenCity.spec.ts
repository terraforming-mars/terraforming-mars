
import { expect } from "chai";
import { OpenCity } from "../../src/cards/OpenCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("OpenCity", function () {
    it("Can play", function () {
        const card = new OpenCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        for (let i = 0; i < 6; i++) {
            game.increaseOxygenLevel(player, 2);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new OpenCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        for (let i = 0; i < 6; i++) {
            game.increaseOxygenLevel(player, 2);
        }
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(4);
        expect(player.plants).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
        expect(game.getCitiesInPlayOnMars()).to.eq(1); 
    });
 });
