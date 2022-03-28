import {expect} from 'chai';
import {Game} from '../src/Game';
import {SpaceName} from '../src/SpaceName';
import {Mayor} from '../src/milestones/Mayor';
import {Banker} from '../src/awards/Banker';
import {Thermalist} from '../src/awards/Thermalist';
import * as constants from '../src/common/constants';
import {Birds} from '../src/cards/base/Birds';
import {WaterImportFromEuropa} from '../src/cards/base/WaterImportFromEuropa';
import {Phase} from '../src/common/Phase';
import {TestingUtils} from './TestingUtils';
import {TestPlayers} from './TestPlayers';
import {SaturnSystems} from '../src/cards/corporation/SaturnSystems';
import {Resources} from '../src/common/Resources';
import {ISpace} from '../src/boards/ISpace';
import {SpaceId} from '../src/common/Types';
import {ResearchNetwork} from '../src/cards/prelude/ResearchNetwork';
import {ArcticAlgae} from '../src/cards/base/ArcticAlgae';
import {Ecologist} from '../src/milestones/Ecologist';
import {OrOptions} from '../src/inputs/OrOptions';
import {BoardName} from '../src/common/boards/BoardName';
import {SpaceType} from '../src/common/boards/SpaceType';
import {Helion} from '../src/cards/corporation/Helion';
import {CardName} from '../src/common/cards/CardName';
import {Player} from '../src/Player';
import {Color} from '../src/common/Color';
import {RandomMAOptionType} from '../src/common/ma/RandomMAOptionType';
import {SpaceBonus} from '../src/common/boards/SpaceBonus';
import {TileType} from '../src/common/TileType';

describe('Game', () => {
  it('should initialize with right defaults', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    expect(game.gameOptions.corporateEra).is.true;
    expect(game.getGeneration()).to.eq(1);
  });

  it('sets starting production if corporate era not selected', () => {
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({corporateEra: false});

    Game.newInstance('foobar', [player], player, gameOptions);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });

  it('correctly calculates victory points', () => {
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

  it('Disallows to set oxygenLevel more than allowed maximum', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);

    (game as any).oxygenLevel = 13;
    const initialTR = player.getTerraformRating();
    game.increaseOxygenLevel(player, 2);

    expect(game.getOxygenLevel()).to.eq(constants.MAX_OXYGEN_LEVEL);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });

  it('Draft round for 2 players', () => {
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

  it('No draft round for 2 players', () => {
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

  it('Solo play next generation', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('solo game', [player], player);
    game.gameOptions.venusNextExtension = false;
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
    expect(game.getGeneration()).to.eq(2);
  });

  it('Should not finish game before Venus is terraformed, if chosen', () => {
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

  it('Should finish game if Mars and Venus is terraformed, if chosen', () => {
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

    // Must remove waitingFor or playerIsFinishedTakingActions
    // will pre-emptively exit -- you can't end the game
    // if the game is waiting for a player to do something!
    (player as any).waitingFor = undefined;
    (player2 as any).waitingFor = undefined;
    game.playerIsFinishedTakingActions();
    // Now game should be in end state
    expect(game.phase).to.eq(Phase.END);
  });

  it('Should not finish game if Mars is not terraformed but Venus is terraformed, if chosen', () => {
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

  it('Should finish solo game in the end of last generation', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('solo1', [player], player);
    game.playerIsDoneWithGame(player);

    // Now game should be in finished state
    expect(game.phase).to.eq(Phase.END);

    expect(game.isSoloModeWin()).is.not.true;
  });

  it('Should not finish solo game before last generation if Mars is already terraformed', () => {
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

  it('Should not give TR or raise oxygen for final greenery placements', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const otherPlayer = TestPlayers.RED.newPlayer();

    const game = Game.newInstance('foobar', [player, otherPlayer], player);
    game.generation = 14;

    // Terraform
    (game as any).temperature = constants.MAX_TEMPERATURE;
    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL - 2;
    TestingUtils.maxOutOceans(player);

    // Must remove waitingFor or playerIsFinishedTakingActions
    // will pre-emptively exit -- you can't end the game
    // if the game is waiting for a player to do something!
    (player as any).waitingFor = undefined;
    (otherPlayer as any).waitingFor = undefined;

    // Trigger end game
    player.setTerraformRating(20);
    player.plants = 14;
    player.takeActionForFinalGreenery();

    // Place first greenery to get 2 plants
    const placeFirstGreenery = TestingUtils.cast(player.getWaitingFor(), OrOptions);
    const arsiaMons = game.board.getSpace(SpaceName.ARSIA_MONS);
    placeFirstGreenery.options[0].cb(arsiaMons);
    expect(player.plants).to.eq(8);

    // Place second greenery
    const placeSecondGreenery = TestingUtils.cast(player.getWaitingFor(), OrOptions);
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
    const player1 = new Player('p1', Color.BLUE, false, 0, 'p1-id');
    const player2 = new Player('p2', Color.GREEN, false, 0, 'p2-id');
    const player3 = new Player('p3', Color.YELLOW, false, 0, 'p3-id');
    const player4 = new Player('p4', Color.RED, false, 0, 'p4-id');
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player3);

    game.getPlayersInGenerationOrder().forEach((p) => {
      (p as any).waitingFor = undefined;
      p.plants = 8;
    });

    game.gotoFinalGreeneryPlacement();

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.not.undefined;
    expect(player4.getWaitingFor()).is.undefined;

    // Skipping plants placement. Option 1 is "Don't place plants".
    // This weird input is what would come from the server, and indicates "Don't place plants".
    player3.process([['1'], []]);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.not.undefined;

    player4.process([['1'], []]);

    expect(player1.getWaitingFor()).is.not.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.undefined;

    player1.process([['1'], []]);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.not.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.undefined;

    player2.process([['1'], []]);

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.undefined;

    expect(game.phase).eq(Phase.END);
  });

  it('Final greenery placement skips players without enough plants', () => {
    const player1 = new Player('p1', Color.BLUE, false, 0, 'p1-id');
    const player2 = new Player('p2', Color.GREEN, false, 0, 'p2-id');
    const player3 = new Player('p3', Color.YELLOW, false, 0, 'p3-id');
    const player4 = new Player('p4', Color.RED, false, 0, 'p4-id');
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player2);
    (game as any).incrementFirstPlayer();

    game.getPlayersInGenerationOrder().forEach((p) => {
      (p as any).waitingFor = undefined;
    });

    player1.plants = 8;
    player4.plants = 8;

    game.gotoFinalGreeneryPlacement();

    // Even though player 3 is first player, they have no plants. So player 4 goes.

    expect(player1.getWaitingFor()).is.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.not.undefined;

    // Skipping plants placement. Option 1 is "Don't place plants".
    // This weird input is what would come from the server, and indicates "Don't place plants".
    player4.process([['1'], []]);

    // After that, player 1 has plants.
    expect(player1.getWaitingFor()).is.not.undefined;
    expect(player2.getWaitingFor()).is.undefined;
    expect(player3.getWaitingFor()).is.undefined;
    expect(player4.getWaitingFor()).is.undefined;

    player1.process([['1'], []]);

    // But player 2 doesn't, and so the game is over.
    expect(game.phase).eq(Phase.END);
  });


  it('Should return players in turn order', () => {
    const player1 = new Player('p1', Color.BLUE, false, 0, 'p1-id');
    const player2 = new Player('p2', Color.GREEN, false, 0, 'p2-id');
    const player3 = new Player('p3', Color.YELLOW, false, 0, 'p3-id');
    const player4 = new Player('p4', Color.RED, false, 0, 'p4-id');
    const game = Game.newInstance('gto', [player1, player2, player3, player4], player3);

    let players = game.getPlayersInGenerationOrder();
    expect(players[0].name).to.eq('p3');
    expect(players[1].name).to.eq('p4');
    expect(players[2].name).to.eq('p1');
    expect(players[3].name).to.eq('p2');


    (game as any).incrementFirstPlayer();
    players = game.getPlayersInGenerationOrder();
    expect(players[0].name).to.eq('p4');
    expect(players[1].name).to.eq('p1');
    expect(players[2].name).to.eq('p2');
    expect(players[3].name).to.eq('p3');

    (game as any).incrementFirstPlayer();
    players = game.getPlayersInGenerationOrder();
    expect(players[0].name).to.eq('p1');
    expect(players[1].name).to.eq('p2');
    expect(players[2].name).to.eq('p3');
    expect(players[3].name).to.eq('p4');
  });

  it('Gets card player for corporation card', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('gto', [player], player);
    const card = new SaturnSystems();
    player.corporationCard = card;
    expect(game.getCardPlayer(card.name)).to.eq(player);
  });

  it('Does not assign player to ocean after placement', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('oceanz', [player], player);
    const spaceId: SpaceId = game.board.getAvailableSpacesForOcean(player)[0].id;
    game.addOceanTile(player, spaceId);

    const space: ISpace = game.board.getSpace(spaceId);
    expect(space.player).is.undefined;
  });

  it('Check Ecologist Milestone', () => {
    const player = TestPlayers.BLUE.newPlayer();

    const card1 = new ResearchNetwork();
    const card2 = new ArcticAlgae();
    const ecologist = new Ecologist();

    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.not.true;
    player.playedCards.push(card1, card2);
    expect(ecologist.canClaim(player)).is.true;
  });

  it('Removes Hellas bonus ocean space if player cannot pay', () => {
    const player = TestPlayers.BLUE.newPlayer();

    // NOTE: By setting up the two-player game, instead of a solo game as we regularly do
    // the neutral player can't claim the bonus ocean space before our player has a
    // chance.
    const secondPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({boardName: BoardName.HELLAS});
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

  it('Removes Hellas bonus ocean space if Helion player cannot pay', () => {
    const player = TestPlayers.BLUE.newPlayer();
    // NOTE: By setting up the two-player game, instead of a solo game as we regularly do
    // the neutral player can't claim the bonus ocean space before our player has a
    // chance.
    const secondPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({boardName: BoardName.HELLAS});
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

  it('Generates random milestones and awards', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({boardName: BoardName.HELLAS, randomMA: RandomMAOptionType.UNLIMITED});
    const game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    const prevMilestones = game.milestones.map((m) => m.name).sort();
    const prevAwards = game.awards.map((a) => a.name).sort();

    const game2 = Game.newInstance('foobar2', [player, player2], player, gameOptions);

    const milestones = game2.milestones.map((m) => m.name).sort();
    const awards = game2.awards.map((a) => a.name).sort();

    expect(prevMilestones).to.not.eq(milestones);
    expect(prevAwards).to.not.eq(awards);
  });

  it('specifically-requested corps override expansion corps', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const corpsFromTurmoil = [
      CardName.LAKEFRONT_RESORTS,
      CardName.PRISTAR,
      CardName.TERRALABS_RESEARCH,
      CardName.UTOPIA_INVEST,
    ];
    const gameOptions = TestingUtils.setCustomGameOptions({customCorporationsList: corpsFromTurmoil, turmoilExtension: false});
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

  it('grant space bonus sanity test', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const space = game.board.getAvailableSpacesOnLand(player)[0];

    space.bonus = [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.PLANT, SpaceBonus.TITANIUM];
    expect(player.cardsInHand).has.length(0);
    expect(player.plants).eq(0);
    expect(player.titanium).eq(0);

    game.addTile(player, space.spaceType, space, {tileType: TileType.GREENERY});

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
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const serialized = game.serialize();
    const serializedKeys = Object.keys(serialized);
    expect(serializedKeys).not.include('rng');
    const gameKeys = Object.keys(game);
    expect(gameKeys).not.include('moonData');
    expect(gameKeys).not.include('pathfindersData');
    expect(serializedKeys.concat('rng', 'discardedColonies').sort())
      .deep.eq(gameKeys.concat('moonData', 'pathfindersData', 'seed', 'currentSeed').sort());
  });

  it('deserializing a game without moon data still loads', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({moonExpansion: false}));
    const serialized = game.serialize();
    delete serialized['moonData'];
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.moonData).is.undefined;
  });

  it('deserializing a game without pathfinders still loads', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: false}));
    const serialized = game.serialize();
    (serialized.gameOptions as any).pathfindersData = undefined;
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.pathfindersData).is.undefined;
  });

  it('deserializing a game with awards', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: false}));
    const serialized = game.serialize();
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.awards).deep.eq(game.awards);
  });

  it('deserializing a game with milestones', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: false}));
    const serialized = game.serialize();
    const deserialized = Game.deserialize(serialized);
    expect(deserialized.milestones).deep.eq(game.milestones);
  });
});
