import {expect} from 'chai';
import {Game} from '../src/Game';
import {SpaceName} from '../src/SpaceName';
import {Mayor} from '../src/milestones/Mayor';
import {Banker} from '../src/awards/Banker';
import {Thermalist} from '../src/awards/Thermalist';
import * as constants from '../src/constants';
import {Birds} from '../src/cards/base/Birds';
import {WaterImportFromEuropa} from '../src/cards/base/WaterImportFromEuropa';
import {Phase} from '../src/Phase';
import {TestingUtils, setCustomGameOptions} from './TestingUtils';
import {TestPlayers} from './TestPlayers';
import {SaturnSystems} from '../src/cards/corporation/SaturnSystems';
import {Resources} from '../src/Resources';
import {ISpace, SpaceId} from '../src/boards/ISpace';
import {ResearchNetwork} from '../src/cards/prelude/ResearchNetwork';
import {ArcticAlgae} from '../src/cards/base/ArcticAlgae';
import {Ecologist} from '../src/milestones/Ecologist';
import {OrOptions} from '../src/inputs/OrOptions';
import {BoardName} from '../src/boards/BoardName';
import {SpaceType} from '../src/SpaceType';
import {Helion} from '../src/cards/corporation/Helion';
import {CardName} from '../src/CardName';
import {Player} from '../src/Player';
import {Color} from '../src/Color';
import {RandomMAOptionType} from '../src/RandomMAOptionType';

describe('Game', function() {
  it('should initialize with right defaults', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    expect(game.gameOptions.corporateEra).is.true;
    expect(game.getGeneration()).to.eq(1);
  });

  it('sets starting production if corporate era not selected', function() {
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions({corporateEra: false});

    Game.newInstance('foobar', [player], player, gameOptions);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });

  it('correctly calculates victory points', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const player3 = TestPlayers.YELLOW.newPlayer();
    const game = Game.newInstance('vp_game', [player, player2, player3], player);

    game.addCityTile(player, SpaceName.ARSIA_MONS);
    game.addGreenery(player, SpaceName.PAVONIS_MONS);

    // Claim milestone
    const milestone = new Mayor();

    game.claimedMilestones.push({
      player: player,
      milestone: milestone,
    });

    // Fund awards
    let award = new Banker();
    game.fundAward(player, award);

    // Set second player to win Banker award
    player2.addProduction(Resources.MEGACREDITS, 10);

    // Our testing player will be 2nd Banker in the game
    player.addProduction(Resources.MEGACREDITS, 7);

    // Two other players will share Thermalist award
    award = new Thermalist();
    game.fundAward(player, award);

    player2.heat = 23;
    player3.heat = 23;

    // Add some cards with VPs
    const birdsCard = new Birds();
    birdsCard.resourceCount += 6;
    player.playedCards.push(birdsCard);

    player2.playedCards.push(new WaterImportFromEuropa());

    // Finish the game
    game.playerIsDoneWithGame(player3);
    game.playerIsDoneWithGame(player2);
    game.playerIsDoneWithGame(player);

    player.getVictoryPoints();
    player2.getVictoryPoints();
    player3.getVictoryPoints();

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

  it('Disallows to set temperature more than allowed maximum', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);

    (game as any).temperature = 6;
    let initialTR = player.getTerraformRating();
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

  it('Disallows to set oxygenLevel more than allowed maximum', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);

    (game as any).oxygenLevel = 13;
    const initialTR = player.getTerraformRating();
    game.increaseOxygenLevel(player, 2);

    expect(game.getOxygenLevel()).to.eq(constants.MAX_OXYGEN_LEVEL);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });

  it('Draft round for 2 players', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('draft_game', [player, player2], player);
    game.gameOptions.venusNextExtension = false;
    game.generation = 4;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(5);
  });

  it('No draft round for 2 players', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('classic_game', [player, player2], player);
    game.gameOptions.venusNextExtension = false;
    game.generation = 2;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(3);
  });

  it('Solo play next generation', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('solo game', [player], player);
    game.gameOptions.venusNextExtension = false;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(2);
  });

  it('Should not finish game before Venus is terraformed, if chosen', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('venusterraform', [player, player2], player);
    game.gameOptions.venusNextExtension = true;
    game.gameOptions.requiresVenusTrackCompletion = true;
    (game as any).temperature = constants.MAX_TEMPERATURE;
    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
    // (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    (game as any).venusScaleLevel = 6;
    TestingUtils.maxOutOceans(player);
    // Skip final greenery Phase
    player.plants = 0;
    player2.plants = 0;
    // Pass last turn
    game.playerHasPassed(player);
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    // Now game should be in research state
    expect(game.phase).to.eq(Phase.RESEARCH);
  });

  it('Should finish game if Mars and Venus is terraformed, if chosen', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('venusterraform', [player, player2], player);
    game.gameOptions.venusNextExtension = true;
    game.gameOptions.requiresVenusTrackCompletion = true;
    (game as any).temperature = constants.MAX_TEMPERATURE;
    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    TestingUtils.maxOutOceans(player);
    // Skip final greenery Phase
    player.plants = 0;
    player2.plants = 0;
    // Pass last turn
    game.playerHasPassed(player);
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    // Now game should be in end state
    expect(game.phase).to.eq(Phase.END);
  });

  it('Should not finish game if Mars is not terraformed but Venus is terraformed, if chosen', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('venusterraform', [player, player2], player);
    game.gameOptions.venusNextExtension = true;
    game.gameOptions.requiresVenusTrackCompletion = true;
    (game as any).temperature = 2;
    (game as any).oxygenLevel = 2;
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
    TestingUtils.maxOutOceans(player);
    // Skip final greenery Phase
    player.plants = 0;
    player2.plants = 0;
    // Pass last turn
    game.playerHasPassed(player);
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    // Now game should be in research state
    expect(game.phase).to.eq(Phase.RESEARCH);
  });

  it('Should finish solo game in the end of last generation', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('solo1', [player], player);
    game.playerIsDoneWithGame(player);

    // Now game should be in finished state
    expect(game.phase).to.eq(Phase.END);

    expect(game.isSoloModeWin()).is.not.true;
  });

  it('Should not finish solo game before last generation if Mars is already terraformed', function() {
    const player = TestPlayers.BLUE.newPlayer();

    const game = Game.newInstance('solo2', [player], player);
    game.generation = 10;

    // Terraform
    (game as any).temperature = constants.MAX_TEMPERATURE;
    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
    TestingUtils.maxOutOceans(player);

    player.plants = 0; // Skip final greenery Phase

    // Pass last turn
    game.playerHasPassed(player);

    // Now game should be in research state
    expect(game.phase).to.eq(Phase.RESEARCH);
  });

  it('Should not give TR or raise oxygen for final greenery placements', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    const game = Game.newInstance('foobar', [player, redPlayer], player);
    game.generation = 14;

    // Terraform
    (game as any).temperature = constants.MAX_TEMPERATURE;
    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL - 2;
    TestingUtils.maxOutOceans(player);

    // Trigger end game
    player.setTerraformRating(20);
    player.plants = 14;
    player.takeActionForFinalGreenery();

    // Place first greenery to get 2 plants
    const placeFirstGreenery = player.getWaitingFor() as OrOptions;
    const arsiaMons = game.board.getSpace(SpaceName.ARSIA_MONS);
    placeFirstGreenery.options[0].cb(arsiaMons);
    expect(player.plants).to.eq(8);

    // Place second greenery
    const placeSecondGreenery = player.getWaitingFor() as OrOptions;
    const otherSpace = game.board.getSpace('30');
    placeSecondGreenery.options[0].cb(otherSpace); ;

    // End the game
    game.playerHasPassed(player);
    game.playerIsDoneWithGame(player);
    expect(game.phase).to.eq(Phase.END);
    expect(game.isSoloModeWin()).is.not.true;

    // Don't give TR or raise oxygen for final greenery placements
    expect(player.getTerraformRating()).to.eq(20);
    expect(game.getOxygenLevel()).to.eq(12);
  });

  it('Should return players in turn order', function() {
    const player1 = new Player('p1', Color.BLUE, false, 0, 'p1-id');
    const player2 = new Player('p2', Color.GREEN, false, 0, 'p2-id');
    const player3 = new Player('p3', Color.YELLOW, false, 0, 'p3-id');
    const player4 = new Player('p4', Color.RED, false, 0, 'p4-id');
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player3);

    let players = game.getPlayers();
    expect(players[0].name).to.eq('p3');
    expect(players[1].name).to.eq('p4');
    expect(players[2].name).to.eq('p1');
    expect(players[3].name).to.eq('p2');


    (game as any).incrementFirstPlayer();
    players = game.getPlayers();
    expect(players[0].name).to.eq('p4');
    expect(players[1].name).to.eq('p1');
    expect(players[2].name).to.eq('p2');
    expect(players[3].name).to.eq('p3');

    (game as any).incrementFirstPlayer();
    players = game.getPlayers();
    expect(players[0].name).to.eq('p1');
    expect(players[1].name).to.eq('p2');
    expect(players[2].name).to.eq('p3');
    expect(players[3].name).to.eq('p4');
  });

  it('Gets card player for corporation card', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('gto', [player], player);
    const card = new SaturnSystems();
    player.corporationCard = card;
    expect(game.getCardPlayer(card.name)).to.eq(player);
  });

  it('Does not assign player to ocean after placement', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('oceanz', [player], player);
    const spaceId: SpaceId = game.board.getAvailableSpacesForOcean(player)[0].id;
    game.addOceanTile(player, spaceId);

    const space: ISpace = game.board.getSpace(spaceId);
    expect(space.player).is.undefined;
  });

  it('Check Ecologist Milestone', function() {
    const player = TestPlayers.BLUE.newPlayer();

    const card1 = new ResearchNetwork();
    const card2 = new ArcticAlgae();
    const ecologist = new Ecologist();

    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.not.true;
    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.true;
  });

  it('Removes Hellas bonus ocean space if player cannot pay', function() {
    const player = TestPlayers.BLUE.newPlayer();

    // NOTE: By setting up the two-player game, instead of a solo game as we regularly do
    // the neutral player can't claim the bonus ocean space before our player has a
    // chance.
    const secondPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS});
    const game = Game.newInstance('foobar', [player, secondPlayer], player, gameOptions);

    // Ensuring that HELLAS_OCEAN_TILE will be available for the test.
    expect(game.board.getEmptySpaces().map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);

    // Cannot afford
    player.megaCredits = 5;
    let landSpaces = game.board.getSpaces(SpaceType.LAND, player);
    expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).is.undefined;
    let availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    // Can afford
    player.megaCredits = 6;
    landSpaces = game.board.getSpaces(SpaceType.LAND, player);
    expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).is.not.undefined;
    availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);
  });

  it('Removes Hellas bonus ocean space if Helion player cannot pay', function() {
    const player = TestPlayers.BLUE.newPlayer();
    // NOTE: By setting up the two-player game, instead of a solo game as we regularly do
    // the neutral player can't claim the bonus ocean space before our player has a
    // chance.
    const secondPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS});
    const game = Game.newInstance('foobar', [player, secondPlayer], player, gameOptions);
    player.corporationCard = new Helion();
    player.canUseHeatAsMegaCredits = true;

    // Ensuring that HELLAS_OCEAN_TILE will be available for the test.
    expect(game.board.getEmptySpaces().map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);

    // Cannot afford
    player.heat = 2;
    player.megaCredits = 3;
    let landSpaces = game.board.getSpaces(SpaceType.LAND, player);
    expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).is.undefined;
    let availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    // Can afford
    player.megaCredits += 1;
    landSpaces = game.board.getSpaces(SpaceType.LAND, player);
    expect(landSpaces.find((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).is.not.undefined;
    availableSpacesOnLand = game.board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);
  });

  it('Generates random milestones and awards', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions({boardName: BoardName.HELLAS, randomMA: RandomMAOptionType.UNLIMITED});
    const game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    const prevMilestones = game.milestones.map((m) => m.name).sort();
    const prevAwards = game.awards.map((a) => a.name).sort();

    const game2 = Game.newInstance('foobar2', [player, player2], player, gameOptions);

    const milestones = game2.milestones.map((m) => m.name).sort();
    const awards = game2.awards.map((a) => a.name).sort();

    expect(prevMilestones).to.not.eq(milestones);
    expect(prevAwards).to.not.eq(awards);
  });

  it('specifically-requested corps override expansion corps', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const corpsFromTurmoil = [
      CardName.LAKEFRONT_RESORTS,
      CardName.PRISTAR,
      CardName.TERRALABS_RESEARCH,
      CardName.UTOPIA_INVEST,
    ];
    const gameOptions = setCustomGameOptions({customCorporationsList: corpsFromTurmoil, turmoilExtension: false});
    Game.newInstance('foobar', [player, player2], player, gameOptions);

    const corpsAssignedToPlayers =
            [...player.dealtCorporationCards, ...player2.dealtCorporationCards].map((c) => c.name);

    expect(corpsAssignedToPlayers).has.members(corpsFromTurmoil);
  });

  it('fails when the same id appears in two players', () => {
    const player1 = new Player('name', Color.BLUE, false, 0, 'id3');
    const player2 = new Player('name', Color.RED, false, 0, 'id3');
    expect(
      () => Game.newInstance('id', [player1, player2], player1))
      .to.throw(Error, /Duplicate player found: id3,id3/);
  });

  it('fails when first player is absent from the list of players.', () => {
    expect(
      () => Game.newInstance('id', [TestPlayers.RED.newPlayer(), TestPlayers.BLUE.newPlayer()], TestPlayers.YELLOW.newPlayer()))
      .to.throw(Error, /Cannot find first player/);
  });

  it('fails when the same color appears in two players', () => {
    const player1 = new Player('name', Color.RED, false, 0, 'id1');
    const player2 = new Player('name', Color.RED, false, 0, 'id2');
    expect(
      () => Game.newInstance('id', [player1, player2], player1))
      .to.throw(Error, /Duplicate color found/);
  });

  /**
   * ensure as we modify properties we consider
   * serialization. if this fails update SerializedGame
   * to match
   */
  it('serializes properties', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const serialized = game.serialize();
    const serializedKeys = Object.keys(serialized);
    const gameKeys = Object.keys(game);
    expect(gameKeys).not.include('moonData');
    expect(serializedKeys).to.have.members(gameKeys.concat('moonData'));
  });

  it('serializes every property', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, setCustomGameOptions({moonExpansion: true}));
    const serialized = game.serialize();
    const serializedKeys = Object.keys(serialized);
    const gameKeys = Object.keys(game);
    expect(serializedKeys).to.have.members(gameKeys);
  });

  it('deserializing a game without moon data still loads', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, setCustomGameOptions({moonExpansion: false}));
    const serialized = game.serialize();
    delete serialized['moonData'];
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.moonData).is.undefined;
  });
});
