
import { expect } from "chai";
import { Color } from "../src/Color";
import { Game } from "../src/Game";
import { Player } from "../src/Player";
import { SpaceName } from "../src/SpaceName";
import { Mayor } from "../src/milestones/Mayor";
import { Banker } from "../src/awards/Banker";
import { Thermalist } from "../src/awards/Thermalist";
import * as constants from "../src/constants";
import { Birds } from "../src/cards/Birds";
import { WaterImportFromEuropa } from "../src/cards/WaterImportFromEuropa";
import { Phase } from "../src/Phase";
import { maxOutOceans } from "./TestingUtils";
import { SaturnSystems } from "../src/cards/corporation/SaturnSystems";
import { Resources } from '../src/Resources';
import { ISpace } from "../src/ISpace";
//import { BoardName } from '../src/BoardName';
import { ResearchNetwork } from '../src/cards/prelude/ResearchNetwork';
import { ArcticAlgae } from "../src/cards/ArcticAlgae";
import { Ecologist } from '../src/milestones/Ecologist';

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
        const player3 = new Player("vp_test3", Color.YELLOW, false);
        const game = new Game("vp_game", [player,player2,player3], player);

        game.addCityTile(player, SpaceName.ARSIA_MONS);
        game.addGreenery(player, SpaceName.PAVONIS_MONS);
   
        // Claim milestone
        let milestone = new Mayor();

        game.claimedMilestones.push({
            player: player,
            milestone: milestone
        });

        // Fund awards
        let award = new Banker()
        game.fundAward(player, award);

        // Set second player to win Banker award
        player2.setProduction(Resources.MEGACREDITS,10);
  
        // Our testing player will be 2nd Banker in the game
        player.setProduction(Resources.MEGACREDITS,7);

        // Two other players will share Thermalist award
        award = new Thermalist();
        game.fundAward(player, award);

        player2.heat = 23;
        player3.heat = 23;

        // Add some cards with VPs
        const birdsCard = new Birds()
        birdsCard.resourceCount += 6;
        player.playedCards.push(birdsCard);

        player2.playedCards.push(new WaterImportFromEuropa())

        // Finish the game
        game.playerIsDoneWithGame(player3);
        game.playerIsDoneWithGame(player2);
        game.playerIsDoneWithGame(player);

        player.getVictoryPoints(game);
        player2.getVictoryPoints(game);
        player3.getVictoryPoints(game);

        expect(player.victoryPointsBreakdown.terraformRating).to.eq(21);
        expect(player.victoryPointsBreakdown.milestones).to.eq(5);
        expect(player.victoryPointsBreakdown.awards).to.eq(2); // one 2nd place
        expect(player.victoryPointsBreakdown.greenery).to.eq(1);
        expect(player.victoryPointsBreakdown.city).to.eq(1); // greenery adjanced to city
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(6);
        expect(player.victoryPointsBreakdown.total).to.eq(36);

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

    it ("Draft round for 2 players", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("draft_game", [player,player2], player);
        game.venusNextExtension = false;
        game.generation = 4;
        game.playerHasPassed(player);
        game.playerIsFinishedTakingActions();
        game.playerHasPassed(player2);
        game.playerIsFinishedTakingActions();
        expect(game.getGeneration()).to.eq(5);
    });    

    it("No draft round for 2 players", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("classic_game", [player,player2], player);
        game.venusNextExtension = false;
        game.generation = 2;
        game.playerHasPassed(player);
        game.playerIsFinishedTakingActions();
        game.playerHasPassed(player2);
        game.playerIsFinishedTakingActions();
        expect(game.getGeneration()).to.eq(3);
    });
 
    it("Solo play next generation", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const game = new Game("draft_game", [player], player);
        game.venusNextExtension = false;
        game.playerHasPassed(player);
        game.playerIsFinishedTakingActions();
        expect(game.getGeneration()).to.eq(2);
    });    

    it("Should finish solo game in the end of last generation", function() {
        const player = new Player("temp_test", Color.BLUE, false);
        const game = new Game("solo1", [player], player);
        game.playerIsDoneWithGame(player);

        // Now game should be in finished state
        expect(game.phase).to.eq(Phase.END);

        expect(game.isSoloModeWin()).to.eq(false);
    });

    it("Should not finish solo game before last generation if Mars is already terraformed", function() {
        const player = new Player("temp_test", Color.BLUE, false);
        const game = new Game("solo2", [player], player);
        game.generation = 10;

        // Terraform
        (game as any).temperature = constants.MAX_TEMPERATURE;
        (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
        maxOutOceans(player, game);

        player.plants = 0; // Skip final greenery Phase

        // Pass last turn
        game.playerHasPassed(player);

        // Now game should be in finished state
        expect(game.phase).to.eq(Phase.RESEARCH);
    });

    it("Should return players in turn order", function () {
        const player1 = new Player("p1", Color.BLUE, false);
        const player2 = new Player("p2", Color.GREEN, false);
        const player3 = new Player("p3", Color.YELLOW, false);
        const player4 = new Player("p4", Color.RED, false);
        const game = new Game("gto", [player1, player2, player3, player4], player3);

        var players = game.getPlayers();
        expect(players[0].name).to.eq("p3");
        expect(players[1].name).to.eq("p4");
        expect(players[2].name).to.eq("p1");
        expect(players[3].name).to.eq("p2");


        (game as any).incrementFirstPlayer();
        players = game.getPlayers();
        expect(players[0].name).to.eq("p4");
        expect(players[1].name).to.eq("p1");
        expect(players[2].name).to.eq("p2");
        expect(players[3].name).to.eq("p3");

        (game as any).incrementFirstPlayer();
        players = game.getPlayers();
        expect(players[0].name).to.eq("p1");
        expect(players[1].name).to.eq("p2");
        expect(players[2].name).to.eq("p3");
        expect(players[3].name).to.eq("p4");
    });

    it("Gets card player for corporation card", function () {
        const player1 = new Player("p1", Color.BLUE, false);
        const game = new Game("gto", [player1], player1);
        const card = new SaturnSystems();
        player1.corporationCard = card;
        expect(game.getCardPlayer(card.name)).to.eq(player1);
    });

    it("Does not assign player to ocean after placement", function() {
        const player1 = new Player("oc_p1", Color.BLUE, false);
        const game = new Game("oceanz", [player1], player1);
        const spaceId: string = game.board.getAvailableSpacesForOcean(player1)[0].id;
        game.addOceanTile(player1, spaceId);

        const space: ISpace = game.getSpace(spaceId);
        expect(space.player).to.eq(undefined);
    });

    it("Check Ecologist Milestone", function() {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("classic_game", [player,player2], player);
//, false, false, false, false, false, false, undefined, BoardName.ELYSIUM
        const card1 = new ResearchNetwork();
        const card2 = new ArcticAlgae();
        const ecologist = new Ecologist();

        player.playedCards.push(card1, card2);
        expect(ecologist.canClaim(player, game)).to.eq(false);
        player.playedCards.push(card1, card2);
        expect(ecologist.canClaim(player, game)).to.eq(true);
    });    
});
