import {expect} from 'chai';
import {Game} from '../src/server/Game';
import {SpaceName} from '../src/server/SpaceName';
import {Mayor} from '../src/server/milestones/Mayor';
import {Banker} from '../src/server/awards/Banker';
import {Thermalist} from '../src/server/awards/Thermalist';
import * as constants from '../src/common/constants';
import {Birds} from '../src/server/cards/base/Birds';
import {WaterImportFromEuropa} from '../src/server/cards/base/WaterImportFromEuropa';
import {Phase} from '../src/common/Phase';
import {addCity, addGreenery, addOcean, cast, forceGenerationEnd, maxOutOceans, runAllActions, setOxygenLevel, setTemperature, setVenusScaleLevel} from './TestingUtils';
import {TestPlayer} from './TestPlayer';
import {SaturnSystems} from '../src/server/cards/corporation/SaturnSystems';
import {Resource} from '../src/common/Resource';
import {Space} from '../src/server/boards/Space';
import {SpaceId} from '../src/common/Types';
import {ResearchNetwork} from '../src/server/cards/prelude/ResearchNetwork';
import {ArcticAlgae} from '../src/server/cards/base/ArcticAlgae';
import {Ecologist} from '../src/server/milestones/Ecologist';
import {OrOptions} from '../src/server/inputs/OrOptions';
import {BoardName} from '../src/common/boards/BoardName';
import {CardName} from '../src/common/cards/CardName';
import {Player} from '../src/server/Player';
import {Color} from '../src/common/Color';
import {RandomMAOptionType} from '../src/common/ma/RandomMAOptionType';
import {SpaceBonus} from '../src/common/boards/SpaceBonus';
import {TileType} from '../src/common/TileType';
import {IColony} from '../src/server/colonies/IColony';
import {IAward} from '../src/server/awards/IAward';
import {SerializedGame} from '../src/server/SerializedGame';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';

describe('Game', () => {
  it('should initialize with right defaults', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    expect(game.gameOptions.corporateEra).is.true;
    expect(game.getGeneration()).to.eq(1);
  });

  it('sets starting production if corporate era not selected', () => {
    const player = TestPlayer.BLUE.newPlayer();

    Game.newInstance('gameid', [player], player, {corporateEra: false});
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.steel).to.eq(1);
    expect(player.production.titanium).to.eq(1);
    expect(player.production.plants).to.eq(1);
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });

  it('correctly calculates victory points', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const player3 = TestPlayer.YELLOW.newPlayer();
    const game = Game.newInstance('gameid', [player, player2, player3], player);

    addCity(player, SpaceName.ARSIA_MONS);
    addGreenery(player, SpaceName.PAVONIS_MONS);

    // Claim milestone
    const milestone = new Mayor();

    game.claimedMilestones.push({
      player: player,
      milestone: milestone,
    });

    // Fund awards
    let award: IAward = new Banker();
    game.fundAward(player, award);

    // Set second player to win Banker award
    player2.production.add(Resource.MEGACREDITS, 10);

    // Our testing player will be 2nd Banker in the game
    player.production.add(Resource.MEGACREDITS, 7);

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

    const player1VPs = player.getVictoryPoints();
    const player2VPs = player2.getVictoryPoints();
    const player3VPs = player3.getVictoryPoints();

    expect(player1VPs.terraformRating).to.eq(21);
    expect(player1VPs.milestones).to.eq(5);
    expect(player1VPs.awards).to.eq(2); // one 2nd place
    expect(player1VPs.greenery).to.eq(1);
    expect(player1VPs.city).to.eq(1); // greenery adjacent to city
    expect(player1VPs.victoryPoints).to.eq(6);
    expect(player1VPs.total).to.eq(36);

    expect(player2VPs.awards).to.eq(10); // 1st place + one shared 1st place
    expect(player3VPs.awards).to.eq(5); // one shared 1st place
  });

  it('Disallows to set temperature more than allowed maximum', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);

    setTemperature(game, 6);
    let initialTR = player.getTerraformRating();
    game.increaseTemperature(player, 2);

    expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);

    initialTR = player.getTerraformRating();
    setTemperature(game, 6);

    // Try 3 steps increase
    game.increaseTemperature(player, 3);
    expect(game.getTemperature()).to.eq(constants.MAX_TEMPERATURE);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });

  it('Disallows to set oxygenLevel more than allowed maximum', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);

    setOxygenLevel(game, 13);
    const initialTR = player.getTerraformRating();
    game.increaseOxygenLevel(player, 2);

    expect(game.getOxygenLevel()).to.eq(constants.MAX_OXYGEN_LEVEL);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });

  it('Draft round for 2 players', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-draft', [player, player2], player);
    game.generation = 4;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(5);
  });

  it('No draft round for 2 players', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-classic', [player, player2], player);
    game.generation = 2;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    game.playerHasPassed(player2);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(3);
  });

  it('Solo play next generation', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo', [player], player);
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(2);
  });

  it('Should not finish game before Venus is terraformed, if chosen', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-venusterraform', [player, player2], player, {venusNextExtension: true, requiresVenusTrackCompletion: true});
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    // setVenusScaleLevel(game, constants.MAX_VENUS_SCALE);
    setVenusScaleLevel(game, 6);
    maxOutOceans(player);
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

  it('Should finish game if Mars and Venus is terraformed, if chosen', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-venusterraform', [player, player2], player, {venusNextExtension: true, requiresVenusTrackCompletion: true});
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    setVenusScaleLevel(game, constants.MAX_VENUS_SCALE);
    maxOutOceans(player);
    // Skip final greenery Phase
    player.plants = 0;
    player2.plants = 0;
    // Pass last turn
    game.playerHasPassed(player);
    game.playerHasPassed(player2);

    // Must remove waitingFor or playerIsFinishedTakingActions
    // will pre-emptively exit -- you can't end the game
    // if the game is waiting for a player to do something!
    player.popWaitingFor();
    player2.popWaitingFor();
    game.playerIsFinishedTakingActions();
    // Now game should be in end state
    expect(game.phase).to.eq(Phase.END);
  });

  it('Should not finish game if Mars is not terraformed but Venus is terraformed, if chosen', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-venusterraform', [player, player2], player, {venusNextExtension: true, requiresVenusTrackCompletion: true});
    setTemperature(game, 2);
    setOxygenLevel(game, 2);
    setVenusScaleLevel(game, constants.MAX_VENUS_SCALE);
    maxOutOceans(player);
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

  it('Should finish solo game in the end of last generation', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo1', [player], player);
    game.playerIsDoneWithGame(player);

    // Now game should be in finished state
    expect(game.phase).to.eq(Phase.END);

    expect(game.isSoloModeWin()).is.not.true;
  });

  it('Should not finish solo game before last generation if Mars is already terraformed', () => {
    const player = TestPlayer.BLUE.newPlayer();

    const game = Game.newInstance('game-solo2', [player], player);
    game.generation = 10;

    // Terraform
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    maxOutOceans(player);

    player.plants = 0; // Skip final greenery Phase

    // Pass last turn
    game.playerHasPassed(player);

    // Now game should be in research state
    expect(game.phase).to.eq(Phase.RESEARCH);
  });

  it('Solo player should place final greeneries if victory condition met', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo2', [player], player);
    /* Removes SelectInitialCards. The cast verifies that it's popping the right thing. */
    cast(player.popWaitingFor(), SelectInitialCards);

    // Set up end-game conditions
    game.generation = 14;
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    maxOutOceans(player);
    player.plants = 9;

    // Pass last turn
    forceGenerationEnd(game);

    // Final greenery placement is considered part of the production phase.
    expect(game.phase).to.eq(Phase.PRODUCTION);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.title).eq('Place any final greenery from plants');
  });

  it('Solo player should not place final greeneries if victory condition not met', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo2', [player], player);

    // Set up near end-game conditions
    game.generation = 14;
    setTemperature(game, constants.MAX_TEMPERATURE - 2);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    maxOutOceans(player);
    player.plants = 9;

    // Pass last turn
    forceGenerationEnd(game);

    // Now game should be over
    expect(game.phase).to.eq(Phase.END);
  });

  it('Solo player should place final greeneries in TR 63 mode if victory condition is met', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo2', [player], player, {soloTR: true});
    /* Removes SelectInitialCards. The cast verifies that it's popping the right thing. */
    cast(player.popWaitingFor(), SelectInitialCards);

    // Set up end-game conditions
    game.generation = 14;
    player.setTerraformRating(63);
    player.plants = 9;

    // Pass last turn
    forceGenerationEnd(game);

    // Final greenery placement is considered part of the production phase.
    expect(game.phase).to.eq(Phase.PRODUCTION);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.title).eq('Place any final greenery from plants');
  });

  it('Solo player should not place final greeneries in TR63 mode if victory condition not met', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-solo2', [player], player, {soloTR: true});

    // Set up near end-game conditions
    game.generation = 14;
    player.setTerraformRating(62);
    player.plants = 9;

    // Pass last turn
    forceGenerationEnd(game);

    // Now game should be over
    expect(game.phase).to.eq(Phase.END);
  });

  it('Should not give TR or raise oxygen for final greenery placements', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const otherPlayer = TestPlayer.RED.newPlayer();

    const game = Game.newInstance('gameid', [player, otherPlayer], player);
    game.generation = 14;

    // Terraform
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL - 2);
    maxOutOceans(player);

    // Must remove waitingFor or playerIsFinishedTakingActions
    // will pre-emptively exit -- you can't end the game
    // if the game is waiting for a player to do something!
    player.popWaitingFor();
    otherPlayer.popWaitingFor();

    // Trigger end game
    player.setTerraformRating(20);
    player.plants = 14;
    player.takeActionForFinalGreenery();

    // Place first greenery to get 2 plants
    const placeFirstGreenery = cast(player.getWaitingFor(), OrOptions);
    const arsiaMons = game.board.getSpace(SpaceName.ARSIA_MONS);
    placeFirstGreenery.options[0].cb(arsiaMons);
    expect(player.plants).to.eq(8);

    // Place second greenery
    const placeSecondGreenery = cast(player.getWaitingFor(), OrOptions);
    const otherSpace = game.board.getSpace('30');
    placeSecondGreenery.options[0].cb(otherSpace);

    // End the game
    game.playerHasPassed(player);
    game.playerIsDoneWithGame(player);
    expect(game.phase).to.eq(Phase.END);
    expect(game.isSoloModeWin()).is.not.true;

    // Don't give TR or raise oxygen for final greenery placements
    expect(player.getTerraformRating()).to.eq(20);
    expect(game.getOxygenLevel()).to.eq(12);
  });

  it('Final greenery placement in order of the current generation', () => {
    const player1 = new TestPlayer(Color.BLUE);
    const player2 = new TestPlayer(Color.GREEN);
    const player3 = new TestPlayer(Color.YELLOW);
    const player4 = new TestPlayer(Color.RED);
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player3);

    [player1, player2, player3, player4].forEach((p) => {
      p.popWaitingFor();
      p.plants = 8;
    });

    game.takeNextFinalGreeneryAction();

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    expect(player3.getWaitingFor()).is.not.undefined;
    cast(player4.getWaitingFor(), undefined);

    // Skipping plants placement. Option 1 is "Don't place plants".
    // This weird input is what would come from the server, and indicates "Don't place plants".
    player3.process({type: 'or', index: 1, response: {type: 'option'}});

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    expect(player4.getWaitingFor()).is.not.undefined;

    player4.process({type: 'or', index: 1, response: {type: 'option'}});

    expect(player1.getWaitingFor()).is.not.undefined;
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    cast(player4.getWaitingFor(), undefined);

    player1.process({type: 'or', index: 1, response: {type: 'option'}});

    cast(player1.getWaitingFor(), undefined);
    expect(player2.getWaitingFor()).is.not.undefined;
    cast(player3.getWaitingFor(), undefined);
    cast(player4.getWaitingFor(), undefined);

    player2.process({type: 'or', index: 1, response: {type: 'option'}});

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    cast(player4.getWaitingFor(), undefined);

    expect(game.phase).eq(Phase.END);
  });

  it('Final greenery placement skips players without enough plants', () => {
    const player1 = new TestPlayer(Color.BLUE);
    const player2 = new TestPlayer(Color.GREEN);
    const player3 = new TestPlayer(Color.YELLOW);
    const player4 = new TestPlayer(Color.RED);
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player2);
    game.incrementFirstPlayer();

    [player1, player2, player3, player4].forEach((p) => {
      p.popWaitingFor();
    });

    player1.plants = 8;
    player4.plants = 8;

    game.takeNextFinalGreeneryAction();

    // Even though player 3 is first player, they have no plants. So player 4 goes.

    cast(player1.getWaitingFor(), undefined);
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    expect(player4.getWaitingFor()).is.not.undefined;

    // Skipping plants placement. Option 1 is "Don't place plants".
    // This weird input is what would come from the server, and indicates "Don't place plants".
    player4.process({type: 'or', index: 1, response: {type: 'option'}});

    // After that, player 1 has plants.
    expect(player1.getWaitingFor()).is.not.undefined;
    cast(player2.getWaitingFor(), undefined);
    cast(player3.getWaitingFor(), undefined);
    cast(player4.getWaitingFor(), undefined);

    player1.process({type: 'or', index: 1, response: {type: 'option'}});

    // But player 2 doesn't, and so the game is over.
    expect(game.phase).eq(Phase.END);
  });


  it('Should return players in turn order', () => {
    const player1 = new Player('p1', Color.BLUE, false, 0, 'p1-id');
    const player2 = new Player('p2', Color.GREEN, false, 0, 'p2-id');
    const player3 = new Player('p3', Color.YELLOW, false, 0, 'p3-id');
    const player4 = new Player('p4', Color.RED, false, 0, 'p4-id');
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player3);

    expect(game.getPlayersInGenerationOrder().map((p) => p.name)).deep.eq(['p3', 'p4', 'p1', 'p2']);

    game.incrementFirstPlayer();
    expect(game.getPlayersInGenerationOrder().map((p) => p.name)).deep.eq(['p4', 'p1', 'p2', 'p3']);

    game.incrementFirstPlayer();
    expect(game.getPlayersInGenerationOrder().map((p) => p.name)).deep.eq(['p1', 'p2', 'p3', 'p4']);

    game.incrementFirstPlayer();
    expect(game.getPlayersInGenerationOrder().map((p) => p.name)).deep.eq(['p2', 'p3', 'p4', 'p1']);

    game.incrementFirstPlayer();
    expect(game.getPlayersInGenerationOrder().map((p) => p.name)).deep.eq(['p3', 'p4', 'p1', 'p2']);
  });

  it('Gets card player for corporation card', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gto', [player], player);
    const card = new SaturnSystems();
    player.setCorporationForTest(card);
    expect(game.getCardPlayerOrThrow(card.name)).to.eq(player);
  });

  it('Does not assign player to ocean after placement', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('game-oceanz', [player], player);
    const spaceId: SpaceId = game.board.getAvailableSpacesForOcean(player)[0].id;
    addOcean(player, spaceId);

    const space: Space = game.board.getSpace(spaceId);
    expect(space.player).is.undefined;
  });

  it('Check Ecologist Milestone', () => {
    const player = TestPlayer.BLUE.newPlayer();

    const card1 = new ResearchNetwork();
    const card2 = new ArcticAlgae();
    const ecologist = new Ecologist();

    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.not.true;
    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.true;
  });

  it('Generates random milestones and awards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const gameOptions = {boardName: BoardName.HELLAS, randomMA: RandomMAOptionType.UNLIMITED};
    const game = Game.newInstance('gameid', [player, player2], player, gameOptions);

    const prevMilestones = game.milestones.map((m) => m.name).sort();
    const prevAwards = game.awards.map((a) => a.name).sort();

    const game2 = Game.newInstance('game-foobar2', [player, player2], player, gameOptions);

    const milestones = game2.milestones.map((m) => m.name).sort();
    const awards = game2.awards.map((a) => a.name).sort();

    expect(prevMilestones).to.not.eq(milestones);
    expect(prevAwards).to.not.eq(awards);
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5572
  it('Milestones can be claimed', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {});
    player.popWaitingFor();

    player.setTerraformRating(35); // Can claim Terraformer milestone

    player.megaCredits = 7;
    // Cannot afford milestone.
    const actions = cast(player.getActions(), OrOptions);

    expect(actions.options.find((option) => option.title === 'Claim a milestone')).is.undefined;

    player.megaCredits = 8;
    const actions2 = cast(player.getActions(), OrOptions);
    const claimMilestoneAction = cast(actions2.options.find((option) => option.title === 'Claim a milestone'), OrOptions);
    claimMilestoneAction.options[0].cb();
    runAllActions(game);
    expect(game.claimedMilestones.some((cm) => cm.milestone.name === 'Terraformer' && cm.player === player)).is.true;
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5572
  it('Milestones cannot be claimed twice', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {});
    player.popWaitingFor();

    player.setTerraformRating(35); // Can claim Terraformer milestone
    player.megaCredits = 8;
    const actions = cast(player.getActions(), OrOptions);
    const claimMilestoneAction = cast(actions.options.find((option) => option.title === 'Claim a milestone'), OrOptions);
    claimMilestoneAction.options[0].cb();
    runAllActions(game);
    expect(game.claimedMilestones.some((cm) => cm.milestone.name === 'Terraformer' && cm.player === player)).is.true;

    expect(() => claimMilestoneAction.options[0].cb()).to.throw(/Terraformer is already claimed/);
    const actions2 = cast(player.getActions(), OrOptions);
    expect(actions2.options.some((option) => option.title === 'Claim a milestone')).is.false;
  });

  it('specifically-requested corps override expansion corps', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const corpsFromTurmoil = [
      CardName.LAKEFRONT_RESORTS,
      CardName.PRISTAR,
      CardName.TERRALABS_RESEARCH,
      CardName.UTOPIA_INVEST,
    ];
    const gameOptions = {customCorporationsList: corpsFromTurmoil, turmoilExtension: false};
    Game.newInstance('gameid', [player, player2], player, gameOptions);

    const corpsAssignedToPlayers =
            [...player.dealtCorporationCards, ...player2.dealtCorporationCards].map((c) => c.name);

    expect(corpsAssignedToPlayers).has.members(corpsFromTurmoil);
  });

  it('specifically-requested preludes override expansion preludes', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const customPreludes = [
      CardName.MERGER,
      CardName.CORPORATE_ARCHIVES,
      CardName.SURVEY_MISSION,
      CardName.DESIGN_COMPANY,
      CardName.PERSONAL_AGENDA,
      CardName.VITAL_COLONY,
      CardName.STRATEGIC_BASE_PLANNING,
      CardName.EXPERIENCED_MARTIANS,
    ];
    const gameOptions = {preludeExtension: true, customPreludes, pathfindersExpansion: false, promoCardsOption: false};
    Game.newInstance('gameid', [player, player2], player, gameOptions);

    const assignedPreludes =
            [...player.dealtPreludeCards, ...player2.dealtPreludeCards].map((c) => c.name);

    expect(assignedPreludes).has.members(customPreludes);
  });

  it('fails when the same id appears in two players', () => {
    const player1 = new Player('name', Color.BLUE, false, 0, 'p-id3');
    const player2 = new Player('name', Color.RED, false, 0, 'p-id3');
    expect(
      () => Game.newInstance('gameid', [player1, player2], player1))
      .to.throw(Error, /Duplicate player found: p-id3,p-id3/);
  });

  it('fails when first player is absent from the list of players.', () => {
    expect(
      () => Game.newInstance('gameid', [TestPlayer.RED.newPlayer(), TestPlayer.BLUE.newPlayer()], TestPlayer.YELLOW.newPlayer()))
      .to.throw(Error, /Cannot find first player/);
  });

  it('fails when the same color appears in two players', () => {
    const player1 = new Player('name', Color.RED, false, 0, 'p-id1');
    const player2 = new Player('name', Color.RED, false, 0, 'p-id2');
    expect(
      () => Game.newInstance('gameid', [player1, player2], player1))
      .to.throw(Error, /Duplicate color found/);
  });

  it('grant space bonus sanity test', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const space = game.board.getAvailableSpacesOnLand(player)[0];

    space.bonus = [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.PLANT, SpaceBonus.TITANIUM];
    expect(player.cardsInHand).has.length(0);
    expect(player.plants).eq(0);
    expect(player.titanium).eq(0);

    game.addTile(player, space, {tileType: TileType.GREENERY});

    expect(player.cardsInHand).has.length(4);
    expect(player.plants).eq(1);
    expect(player.titanium).eq(1);
  });

  /**
   * ensure as we modify properties we consider
   * serialization. if this fails update SerializedGame
   * to match
   */
  it('serializes properties', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    game.monsInsuranceOwner = undefined;
    game.syndicatePirateRaider = undefined;
    game.moonData = undefined;
    game.pathfindersData = undefined;
    const serialized = game.serialize();
    assertIsJSON(serialized);
    const serializedKeys = Object.keys(serialized);

    const unserializedFieldsInGame: Array<keyof Game> = [
      'rng',
      'discardedColonies',
      'monsInsuranceOwner',
      'createdTime',
      'inputsThisRound',
      'resettable',
      'tags'];
    const serializedValuesNotInGame: Array<keyof SerializedGame> = [
      'seed',
      'currentSeed',
      'createdTimeMs'];

    const gameKeys = Object.keys(game);

    for (const field of unserializedFieldsInGame) {
      expect(serializedKeys).does.not.include(field);
      expect(gameKeys).does.include(field);
    }
    for (const field of serializedValuesNotInGame) {
      expect(gameKeys).does.not.include(field);
      expect(serializedKeys).does.include(field);
    }

    expect(serializedKeys.concat(...unserializedFieldsInGame).sort())
      .deep.eq(gameKeys.concat(...serializedValuesNotInGame).sort());
  });

  it('deserializing a game without moon data still loads', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {moonExpansion: false});
    const serialized = game.serialize();
    delete serialized['moonData'];
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.moonData).is.undefined;
  });

  it('deserializing a game without pathfinders still loads', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {pathfindersExpansion: false});
    const serialized = game.serialize();
    (serialized.gameOptions as any).pathfindersData = undefined;
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.pathfindersData).is.undefined;
  });

  it('deserializing a game with awards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {pathfindersExpansion: false});
    const scientist = game.awards.find((award) => award.name === 'Scientist')!;
    game.fundedAwards.push({
      award: scientist,
      player: player,
    });
    const serialized = game.serialize();
    expect(serialized.fundedAwards).deep.eq([{
      name: 'Scientist',
      playerId: 'p-blue-id',
    }]);
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.awards).deep.eq(game.awards);
    expect(deserialized.fundedAwards).has.length(1);
    expect(deserialized.fundedAwards[0].award.name).eq('Scientist');
    expect(deserialized.fundedAwards[0].player.id).eq('p-blue-id');
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5572
  it('dealing with awards accidentally funded twice', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {pathfindersExpansion: false});
    const scientist = game.awards.find((award) => award.name === 'Scientist')!;

    game.fundedAwards.push({
      award: scientist,
      player: player,
    });

    game.fundedAwards.push({
      award: scientist,
      player: player,
    });

    const serialized = game.serialize();
    // Serializing both of these isn't great, but it's how it works, and demonstrates how the
    // duplication goes away during deserialization
    expect(serialized.fundedAwards).deep.eq([{
      name: 'Scientist',
      playerId: 'p-blue-id',
    },
    {
      name: 'Scientist',
      playerId: 'p-blue-id',
    }]);

    const deserialized = Game.deserialize(serialized);
    expect(deserialized.fundedAwards).has.length(1);
    expect(deserialized.fundedAwards[0].award.name).eq('Scientist');
    expect(deserialized.fundedAwards[0].player.id).eq('p-blue-id');
  });


  it('deserializing a game with milestones', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {pathfindersExpansion: false});
    const terraformier = game.milestones.find((milestone) => milestone.name === 'Terraformer')!;

    game.claimedMilestones.push({
      milestone: terraformier,
      player: player,
    });
    const serialized = game.serialize();
    expect(serialized.claimedMilestones).deep.eq([{
      name: 'Terraformer',
      playerId: 'p-blue-id',
    }]);

    const deserialized = Game.deserialize(serialized);
    expect(deserialized.milestones).deep.eq(game.milestones);
    expect(deserialized.claimedMilestones).has.length(1);
    expect(deserialized.claimedMilestones[0].milestone.name).eq('Terraformer');
    expect(deserialized.claimedMilestones[0].player.id).eq('p-blue-id');
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5572
  it('dealing with milestones accidentally claimed twice', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {pathfindersExpansion: false});
    const terraformier = game.milestones.find((milestone) => milestone.name === 'Terraformer')!;

    game.claimedMilestones.push({
      milestone: terraformier,
      player: player,
    });

    game.claimedMilestones.push({
      milestone: terraformier,
      player: player,
    });

    const serialized = game.serialize();
    // Serializing both of these isn't great, but it's how it works, and demonstrates how the
    // duplication goes away during deserialization
    expect(serialized.claimedMilestones).deep.eq([{
      name: 'Terraformer',
      playerId: 'p-blue-id',
    },
    {
      name: 'Terraformer',
      playerId: 'p-blue-id',
    }]);

    const deserialized = Game.deserialize(serialized);
    expect(deserialized.claimedMilestones).has.length(1);
    expect(deserialized.claimedMilestones[0].milestone.name).eq('Terraformer');
    expect(deserialized.claimedMilestones[0].player.id).eq('p-blue-id');
  });

  it('deserializing a colonies game includes discarded colonies #4522', () => {
    const toName = (x: IColony) => x.name;
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player, {coloniesExtension: false});

    const colonyNames = game.colonies.map(toName);
    const discardedColonyNames = game.discardedColonies.map(toName);

    const serialized = game.serialize();
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.colonies.map(toName)).has.members(colonyNames);
    expect(deserialized.discardedColonies.map(toName)).has.members(discardedColonyNames);
  });
});

function assertIsJSON(serialized: any) {
  for (const field in serialized) {
    if (serialized.hasOwnProperty(field)) {
      const val = serialized[field];
      const type = typeof(val);
      if (type === 'object') {
        assertIsJSON(val);
      } else if (type === 'function') {
        throw new Error(field + ' is invalid');
      }
    }
  }
}
