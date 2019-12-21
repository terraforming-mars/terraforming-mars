
import { expect } from "chai";
import { Color } from "../src/Color";
import { Game } from "../src/Game";
import { Player } from "../src/Player";
import { SpaceName } from "../src/SpaceName";
import { Mayor } from "../src/milestones/Mayor";
import { Banker } from "../src/awards/Banker";
import { Thermalist } from "../src/awards/Thermalist";
import * as constants from "../src/constants";

describe("Game", function () {
    it("should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(game.getGeneration()).to.eq(1);
    });

    it("correctly calculates victory points", function () {
        const player = new Player("vp_test", Color.BLUE, false);
        const player2 = new Player("vp_test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("vp_game", [player,player2,player3], player);

        game.addCityTile(player, SpaceName.ARSIA_MONS);
        game.addGreenery(player, SpaceName.PAVONIS_MONS);

        // Add some initial VPs
        player.victoryPoints += 70;
        
        // claim millestone
        let milestone = new Mayor();

        game.claimedMilestones.push({
            player: player,
            milestone: milestone
        });

        // Fund awards
        let award = new Banker()
        game.fundAward(player, award);

        // Set second player to win Banker award
        player2.megaCreditProduction = 10;
  
        // Our testing player will be 2nd Banker in the game
        player.megaCreditProduction = 7;

        // Two other players will share Thermalist award
        award = new Thermalist();
        game.fundAward(player, award);

        player2.heat = 23;
        player3.heat = 23;

        // Finish the game
        game.playerIsDoneWithGame(player3);
        game.playerIsDoneWithGame(player2);
        game.playerIsDoneWithGame(player);

        expect(player.victoryPointsBreakdown.milestones).to.eq(5);
        expect(player.victoryPointsBreakdown.awards).to.eq(2); // one 2nd place
        expect(player.victoryPointsBreakdown.greenery).to.eq(1);
        expect(player.victoryPointsBreakdown.city).to.eq(1); // greenery adjanced to city
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(70);
        expect(player.victoryPointsBreakdown.total).to.eq(100);

        expect(player2.victoryPointsBreakdown.awards).to.eq(10); // 1st place + one shared 1st place
        expect(player3.victoryPointsBreakdown.awards).to.eq(5); // one shared 1st place

    });

    it("Disallows to set temperature more than allowed maximum", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("vp_game", [player,player2], player);

        (game as any).temperature = 6;
        var initialTR = player.terraformRating;
        game.increaseTemperature(player, 2);

        expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
        expect(player.terraformRating).to.eq(initialTR + 1);

        initialTR = player.terraformRating;
        (game as any).temperature = 6;

        // Try 3 steps increase
        game.increaseTemperature(player, 3);
        expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
        expect(player.terraformRating).to.eq(initialTR + 1);
    });

    it("Disallows to set oxygenLevel more than allowed maximum", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("vp_game", [player,player2], player);

        (game as any).oxygenLevel = 13;
        const initialTR = player.terraformRating;
        game.increaseOxygenLevel(player, 2);

        expect(game.getOxygenLevel()).to.eq(constants.MAX_OXYGEN_LEVEL);
        expect(player.terraformRating).to.eq(initialTR + 1);
    });
});
