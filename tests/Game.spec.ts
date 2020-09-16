import { expect } from "chai";
import { Color } from "../src/Color";
import { Game, GameOptions } from "../src/Game";
import { Player } from "../src/Player";
import { SpaceName } from "../src/SpaceName";
import { Mayor } from "../src/milestones/Mayor";
import { Banker } from "../src/awards/Banker";
import { Thermalist } from "../src/awards/Thermalist";
import * as constants from "../src/constants";
import { Birds } from "../src/cards/Birds";
import { WaterImportFromEuropa } from "../src/cards/WaterImportFromEuropa";
import { Phase } from "../src/Phase";
import { maxOutOceans, setCustomGameOptions } from "./TestingUtils";
import { SaturnSystems } from "../src/cards/corporation/SaturnSystems";
import { Resources } from '../src/Resources';
import { ISpace } from "../src/ISpace";
import { ResearchNetwork } from '../src/cards/prelude/ResearchNetwork';
import { ArcticAlgae } from "../src/cards/ArcticAlgae";
import { Ecologist } from '../src/milestones/Ecologist';
import { Dealer } from "../src/Dealer";
import { OrOptions } from "../src/inputs/OrOptions";
import { BoardName } from "../src/BoardName";
import { SpaceType } from "../src/SpaceType";
import { Helion } from "../src/cards/corporation/Helion";

describe("Game", function () {
    it("should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(game.gameOptions.corporateEra).to.eq(true);
        expect(game.getGeneration()).to.eq(1);
    });

    it("correctly separates 71 corporate era cards", function() {
        // include corporate era
        const dealer = new Dealer(true, false, false, false, false, false);
        expect(dealer.getDeckSize()).to.eq(208);

        // exclude corporate era
        const dealer2 = new Dealer(false, false, false, false, false, false);
        expect(dealer2.getDeckSize()).to.eq(137);
    });

    it("sets starting production if corporate era not selected", function() {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions({corporateEra: false}) as GameOptions;

        new Game("foobar", [player], player, gameOptions);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.getProduction(Resources.HEAT)).to.eq(1);
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
        expect(player.victoryPointsBreakdown.city).to.eq(1); // greenery adjacent to city
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
        var initialTR = player.getTerraformRating();
        game.increaseTemperature(player, 2);

        expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
        expect(player.getTerraformRating()).to.eq(initialTR + 1);

        initialTR = player.getTerraformRating();
        (game as any).temperature = 6;

        // Try 3 steps increase
        game.increaseTemperature(player, 3);
        expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
        expect(player.getTerraformRating()).to.eq(initialTR + 1);
    });

    it("Disallows to set oxygenLevel more than allowed maximum", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("vp_game", [player,player2], player);

        (game as any).oxygenLevel = 13;
        const initialTR = player.getTerraformRating();
        game.increaseOxygenLevel(player, 2);

        expect(game.getOxygenLevel()).to.eq(constants.MAX_OXYGEN_LEVEL);
        expect(player.getTerraformRating()).to.eq(initialTR + 1);
    });

    it ("Draft round for 2 players", function () {
        const player = new Player("temp_test", Color.BLUE, false);
        const player2 = new Player("temp_test2", Color.RED, false);
        const game = new Game("draft_game", [player,player2], player);
        game.gameOptions.venusNextExtension = false;
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
        game.gameOptions.venusNextExtension = false;
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
        game.gameOptions.venusNextExtension = false;
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

    it("Should not give TR or raise oxygen for final greenery placements", function() {
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        game.generation = 14;

        // Terraform
        (game as any).temperature = constants.MAX_TEMPERATURE;
        (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL - 2;
        maxOutOceans(player, game);

        // Trigger end game
        player.setTerraformRating(20);
        player.plants = 14;
        player.takeActionForFinalGreenery(game);

        // Place first greenery to get 2 plants
        const placeFirstGreenery = player.getWaitingFor() as OrOptions;
        const arsiaMons = game.getSpace(SpaceName.ARSIA_MONS);
        placeFirstGreenery.options[0].cb(arsiaMons);
        expect(player.plants).to.eq(8);

        // Place second greenery
        const placeSecondGreenery = player.getWaitingFor() as OrOptions;
        const otherSpace = game.getSpace("30");
        placeSecondGreenery.options[0].cb(otherSpace);;

        // End the game
        game.playerHasPassed(player);
        game.playerIsDoneWithGame(player);
        expect(game.phase).to.eq(Phase.END);
        expect(game.isSoloModeWin()).to.eq(false);

        // Don't give TR or raise oxygen for final greenery placements
        expect(player.getTerraformRating()).to.eq(20);
        expect(game.getOxygenLevel()).to.eq(12);
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
        
        const card1 = new ResearchNetwork();
        const card2 = new ArcticAlgae();
        const ecologist = new Ecologist();

        player.playedCards.push(card1, card2);
        expect(ecologist.canClaim(player)).to.eq(false);
        player.playedCards.push(card1, card2);
        expect(ecologist.canClaim(player)).to.eq(true);
    });

    it("Removes Hellas bonus ocean space if player cannot pay", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS}) as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);
        
        // Cannot afford
        player.megaCredits = 5;
        let landSpaces = game.board.getSpaces(SpaceType.LAND, player);
        expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.eq(undefined);
        let availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
        expect(availableSpacesOnLand.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.eq(undefined);

        // Can afford
        player.megaCredits = 6;
        landSpaces = game.board.getSpaces(SpaceType.LAND, player);
        expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).not.to.eq(undefined);
        availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
        expect(availableSpacesOnLand.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).not.to.eq(undefined);
    });

    it("Removes Hellas bonus ocean space if Helion player cannot pay", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS}) as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);
        player.corporationCard = new Helion();
        player.canUseHeatAsMegaCredits = true;
        
        // Cannot afford
        player.heat = 2;
        player.megaCredits = 3;
        let landSpaces = game.board.getSpaces(SpaceType.LAND, player);
        expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.eq(undefined);
        let availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
        expect(availableSpacesOnLand.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.eq(undefined);

        // Can afford
        player.megaCredits += 1;
        landSpaces = game.board.getSpaces(SpaceType.LAND, player);
        expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).not.to.eq(undefined);
        availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
        expect(availableSpacesOnLand.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).not.to.eq(undefined);
    });

    it("Generates random milestones and awards", function () {
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS, randomMA: true}) as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);

        let prevMilestones = game.milestones.map(m => m.name).sort();
        let prevAwards = game.awards.map(a => a.name).sort();

        const game2 = new Game("foobar2", [player], player, gameOptions);

        let milestones = game2.milestones.map(m => m.name).sort();
        let awards = game2.awards.map(a => a.name).sort();

        expect(prevMilestones).to.not.eq(milestones)
        expect(prevAwards).to.not.eq(awards)
    });
});
