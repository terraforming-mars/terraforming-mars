import {expect} from 'chai';
import {LunarBeam} from '../src/cards/base/LunarBeam';
import {Game} from '../src/Game';
import {Insulation} from '../src/cards/base/Insulation';
import {IoMiningIndustries} from '../src/cards/base/IoMiningIndustries';
import {PowerSupplyConsortium} from '../src/cards/base/PowerSupplyConsortium';
import {SaturnSystems} from '../src/cards/corporation/SaturnSystems';
import {SelectOption} from '../src/inputs/SelectOption';
import {Resources} from '../src/Resources';
import {TestPlayers} from './TestPlayers';
import {SerializedPlayer} from '../src/SerializedPlayer';
import {SerializedTimer} from '../src/SerializedTimer';
import {Player} from '../src/Player';
import {Color} from '../src/Color';
import {VictoryPointsBreakdown} from '../src/VictoryPointsBreakdown';
import {CardName} from '../src/CardName';
import {GlobalParameter} from '../src/GlobalParameter';
import {TestingUtils} from './TestingUtils';
import {Units} from '../src/Units';
import {SelfReplicatingRobots} from '../src/cards/promo/SelfReplicatingRobots';
import {Pets} from '../src/cards/base/Pets';
import {GlobalEventName} from '../src/turmoil/globalEvents/GlobalEventName';

describe('Player', function() {
  it('should initialize with right defaults', function() {
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.corporationCard).is.undefined;
  });
  it('Should throw error if nothing to process', function() {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    (player as any).setWaitingFor(undefined, undefined);
    expect(function() {
      player.process([]);
    }).to.throw('Not waiting for anything');
  });
  it('Should run select player for PowerSupplyConsortium', function() {
    const card = new PowerSupplyConsortium();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const player3 = TestPlayers.YELLOW.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
    player2.addProduction(Resources.ENERGY, 2);
    player3.addProduction(Resources.ENERGY, 2);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new LunarBeam());
    const action = card.play(player); //  Game.newInstance('foobar', [player, player2, player3], player));
    if (action !== undefined) {
      player.setWaitingFor(action);
      player.process([[player2.id]]);
      expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    }
  });
  it('Should error with input for run select player for PowerSupplyConsortium', function() {
    const card = new PowerSupplyConsortium();
    const player = TestPlayers.BLUE.newPlayer();
    // const redPlayer = TestPlayers.RED.newPlayer();

    Game.newInstance('foobar', [player], player);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new LunarBeam());
    const action = card.play(player); // , Game.newInstance('foobar', [player, redPlayer], player));
    if (action !== undefined) {
      player.setWaitingFor(action);
      expect(player.getWaitingFor()).is.not.undefined;
      expect(function() {
        player.process([[]]);
      }).to.throw('Invalid players array provided');
      expect(function() {
        player.process([]);
      }).to.throw('Incorrect options provided');
      expect(function() {
        player.process([['bar']]);
      }).to.throw('Player not available');
    }
  });
  it('Should run select amount for Insulation', function() {
    const card = new Insulation();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    player.addProduction(Resources.HEAT, 2);
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player); // Game.newInstance('foobar', [player, redPlayer], player));
    expect(action).is.not.undefined;
    if (action === undefined) return;
    player.setWaitingFor(action);
    expect(player.getWaitingFor()).is.not.undefined;
    expect(function() {
      player.process([[]]);
    }).to.throw('Incorrect options provided');
    expect(function() {
      player.process([]);
    }).to.throw('Incorrect options provided');
    expect(function() {
      player.process([['foobar']]);
    }).to.throw('Number not provided for amount');
    player.process([['1']]);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getWaitingFor()).is.undefined;
  });
  it('Runs SaturnSystems when other player plays card', function() {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('gto', [player1, player2], player1);
    const card = new IoMiningIndustries();
    const corporationCard = new SaturnSystems();
    expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(0);
    player1.corporationCard = corporationCard;
    player2.playCard(card, undefined);
    expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
  it('Chains onend functions from player inputs', function(done) {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const mockOption3 = new SelectOption('Mock select option 3', 'Save', () => {
      return undefined;
    });
    const mockOption2 = new SelectOption('Mock select option 2', 'Save', () => {
      return mockOption3;
    });
    const mockOption = new SelectOption('Mock select option', 'Save', () => {
      return mockOption2;
    });
    player.setWaitingFor(mockOption, done);
    player.process([['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process([['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process([['1']]);
    expect(player.getWaitingFor()).to.be.undefined;
  });
  it('Omits buffer gas for non solo games', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const player2= TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).to.be.undefined;
  });
  it('Omit buffer gas for solo games without 63 TR', function() {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).to.be.undefined;
  });

  it('wgt includes all parameters at the game start', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({venusNextExtension: false});
    Game.newInstance('foobar', [player], player, gameOptions);
    player.worldGovernmentTerraforming();
    const parameters = waitingForGlobalParameters(player);
    expect(parameters).to.have.members([
      GlobalParameter.OXYGEN,
      GlobalParameter.TEMPERATURE,
      GlobalParameter.OCEANS]);
  });

  it('wgt includes all parameters at the game start, with Venus', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({venusNextExtension: true});
    Game.newInstance('foobar', [player], player, gameOptions);
    player.worldGovernmentTerraforming();
    const parameters = waitingForGlobalParameters(player);
    expect(parameters).to.have.members([
      GlobalParameter.OXYGEN,
      GlobalParameter.TEMPERATURE,
      GlobalParameter.OCEANS,
      GlobalParameter.VENUS]);
  });

  it('wgt includes all parameters at the game start, with The Moon', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({venusNextExtension: false, moonExpansion: true});
    Game.newInstance('foobar', [player], player, gameOptions);
    player.worldGovernmentTerraforming();
    const parameters = waitingForGlobalParameters(player);
    expect(parameters).to.have.members([
      GlobalParameter.OXYGEN,
      GlobalParameter.TEMPERATURE,
      GlobalParameter.OCEANS,
      GlobalParameter.MOON_MINING_RATE,
      GlobalParameter.MOON_COLONY_RATE,
      GlobalParameter.MOON_LOGISTICS_RATE]);
  });

  it('Include buffer gas for solo games with 63 TR', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    game.gameOptions.soloTR = true;
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).not.to.be.undefined;
  });

  it('serialization test for pickedCorporationCard', () => {
    const player = TestPlayers.BLUE.newPlayer();
    player.pickedCorporationCard = new SaturnSystems();
    const json = player.serialize();
    expect(json.pickedCorporationCard).eq('Saturn Systems');
  });
  it('serialization test', () => {
    const json = {
      id: 'p-blue-id',
      pickedCorporationCard: 'Tharsis Republic',
      terraformRating: 20,
      corporationCard: undefined,
      hasIncreasedTerraformRatingThisGeneration: false,
      terraformRatingAtGenerationStart: 20,
      megaCredits: 1,
      megaCreditProduction: 2,
      steel: 3,
      steelProduction: 4,
      titanium: 5,
      titaniumProduction: 6,
      plants: 7,
      plantProduction: 8,
      energy: 9,
      energyProduction: 10,
      heat: 11,
      heatProduction: 12,
      titaniumValue: 13,
      steelValue: 14,
      canUseHeatAsMegaCredits: false,
      actionsTakenThisRound: 15,
      actionsTakenThisGame: 30,
      actionsThisGeneration: [CardName.FACTORUM, CardName.GHG_PRODUCING_BACTERIA],
      corporationInitialActionDone: false,
      dealtCorporationCards: [CardName.THARSIS_REPUBLIC],
      dealtProjectCards: [CardName.FLOATER_LEASING, CardName.BUTTERFLY_EFFECT],
      dealtPreludeCards: [CardName.MOHOLE_EXCAVATION, CardName.LAVA_TUBE_SETTLEMENT],
      cardsInHand: [CardName.EARTH_ELEVATOR, CardName.DUST_SEALS],
      preludeCardsInHand: [CardName.METAL_RICH_ASTEROID, CardName.PSYCHROPHILES],
      playedCards: [], // TODO(kberg): these are SerializedCard.
      draftedCards: [CardName.FISH, CardName.EXTREME_COLD_FUNGUS],
      needsToDraft: false,
      cardCost: 3,
      cardDiscount: 7,
      fleetSize: 99,
      tradesThisTurn: 100,
      colonyTradeOffset: 101,
      colonyTradeDiscount: 102,
      colonyVictoryPoints: 104,
      turmoilPolicyActionUsed: false,
      politicalAgendasActionUsedCount: 0,
      hasTurmoilScienceTagBonus: false,
      victoryPointsBreakdown: {
        terraformRating: 1,
        milestones: 2,
        awards: 3,
        greenery: 4,
        city: 5,
        victoryPoints: 6,
        total: 7,
        detailsCards: [],
        detailsMilestones: [],
        detailsAwards: [],
      } as unknown as VictoryPointsBreakdown, // needs double-conversion as it expects the VPB methods.
      oceanBonus: 86,
      scienceTagCount: 97,
      plantsNeededForGreenery: 5,
      removingPlayers: [],
      removedFromPlayCards: [],
      name: 'player-blue',
      color: 'purple' as Color,
      beginner: true,
      handicap: 4,
      timer: {
        sumElapsed: 0,
        startedAt: 0,
        running: false,
        afterFirstAction: false,
        lastStoppedAt: 0,
      } as SerializedTimer,
    };

    const newPlayer = Player.deserialize(json as SerializedPlayer);

    expect(newPlayer.color).eq(Color.PURPLE);
    expect(newPlayer.tradesThisGeneration).eq(100);
  });
  it('pulls self replicating robots target cards', function() {
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.getSelfReplicatingRobotsTargetCards().length).eq(0);
    const srr = new SelfReplicatingRobots();
    player.playedCards.push(srr);
    srr.targetCards.push({card: new LunarBeam(), resourceCount: 0});
    expect(player.getSelfReplicatingRobotsTargetCards().length).eq(1);
  });

  it('has units', () => {
    const player = TestPlayers.BLUE.newPlayer();

    const units: Units = Units.of({});
    expect(player.hasUnits(units)).is.true;

    units.megacredits = 1;
    expect(player.hasUnits(units)).is.false;
    player.megaCredits = 1;
    expect(player.hasUnits(units)).is.true;

    units.steel = 1;
    expect(player.hasUnits(units)).is.false;
    player.steel = 1;
    expect(player.hasUnits(units)).is.true;

    units.titanium = 1;
    expect(player.hasUnits(units)).is.false;
    player.titanium = 1;
    expect(player.hasUnits(units)).is.true;

    units.plants = 1;
    expect(player.hasUnits(units)).is.false;
    player.plants = 1;
    expect(player.hasUnits(units)).is.true;

    units.energy = 1;
    expect(player.hasUnits(units)).is.false;
    player.energy = 1;
    expect(player.hasUnits(units)).is.true;

    units.heat = 1;
    expect(player.hasUnits(units)).is.false;
    player.heat = 1;
    expect(player.hasUnits(units)).is.true;
  });


  it('add units', () => {
    function asUnits(player: Player): Units {
      return {
        megacredits: player.megaCredits,
        steel: player.steel,
        titanium: player.titanium,
        plants: player.plants,
        energy: player.energy,
        heat: player.heat,
      };
    };

    const player = TestPlayers.BLUE.newPlayer();

    expect(asUnits(player)).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.megaCredits = 20;
    player.steel = 19;
    player.titanium = 18;
    player.plants = 17;
    player.energy = 16;
    player.heat = 15;

    player.addUnits(Units.of({megacredits: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.addUnits(Units.of({steel: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.addUnits(Units.of({titanium: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.addUnits(Units.of({plants: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 16,
      heat: 15,
    });

    player.addUnits(Units.of({energy: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 26,
      heat: 15,
    });

    player.addUnits(Units.of({heat: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 30,
      steel: 29,
      titanium: 28,
      plants: 27,
      energy: 26,
      heat: 25,
    });
  });

  it('deduct units', () => {
    function asUnits(player: Player): Units {
      return {
        megacredits: player.megaCredits,
        steel: player.steel,
        titanium: player.titanium,
        plants: player.plants,
        energy: player.energy,
        heat: player.heat,
      };
    };

    const player = TestPlayers.BLUE.newPlayer();

    expect(asUnits(player)).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.megaCredits = 20;
    player.steel = 19;
    player.titanium = 18;
    player.plants = 17;
    player.energy = 16;
    player.heat = 15;

    player.deductUnits(Units.of({megacredits: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.deductUnits(Units.of({steel: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.deductUnits(Units.of({titanium: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.deductUnits(Units.of({plants: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    player.deductUnits(Units.of({energy: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    player.deductUnits(Units.of({heat: 10}));
    expect(asUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });

  it('deduct production', () => {
    function asProductionUnits(player: Player): Units {
      return {
        megacredits: player.getProduction(Resources.MEGACREDITS),
        steel: player.getProduction(Resources.STEEL),
        titanium: player.getProduction(Resources.TITANIUM),
        plants: player.getProduction(Resources.PLANTS),
        energy: player.getProduction(Resources.ENERGY),
        heat: player.getProduction(Resources.HEAT),
      };
    };

    const player = TestPlayers.BLUE.newPlayer();

    expect(asProductionUnits(player)).deep.eq({
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
    });

    player.setProductionForTest({
      megacredits: 20,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.adjustProduction(Units.of({megacredits: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 19,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.adjustProduction(Units.of({steel: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 18,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.adjustProduction(Units.of({titanium: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 17,
      energy: 16,
      heat: 15,
    });

    player.adjustProduction(Units.of({plants: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 16,
      heat: 15,
    });

    player.adjustProduction(Units.of({energy: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 15,
    });

    player.adjustProduction(Units.of({heat: -10}));
    expect(asProductionUnits(player)).deep.eq({
      megacredits: 10,
      steel: 9,
      titanium: 8,
      plants: 7,
      energy: 6,
      heat: 5,
    });
  });

  it('addResourceTo', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);

    const log = game.gameLog;
    log.length = 0; // Empty it out.

    const card = new Pets();
    expect(card.resourceCount).eq(0);
    expect(log.length).eq(0);

    player.addResourceTo(card);
    expect(card.resourceCount).eq(1);
    expect(log.length).eq(0);

    player.addResourceTo(card, 1);
    expect(card.resourceCount).eq(2);
    expect(log.length).eq(0);

    player.addResourceTo(card, 3);
    expect(card.resourceCount).eq(5);
    expect(log.length).eq(0);

    player.addResourceTo(card, {qty: 3, log: true});
    expect(log.length).eq(1);
    const logEntry = log[0];
    expect(logEntry.data[1].value).eq('3');
    expect(logEntry.data[3].value).eq('Pets');
  });

  it('addResourceTo with Mons Insurance hook does not remove when no credits', () => {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player1, player2], player1);
    player1.megaCredits = 0;
    player1.setProductionForTest({
      megacredits: -5,
    });
    player2.megaCredits = 3;
    game.monsInsuranceOwner = player2.id;
    player1.addResource(Resources.MEGACREDITS, -3, {from: player2, log: false});
    expect(player2.megaCredits).eq(3); ;
    player1.addProduction(Resources.MEGACREDITS, -3, {from: player2, log: false});
    expect(player2.megaCredits).eq(3);
  });

  it('adds resources', () => {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('x', [player], player);
    player.megaCredits = 10;
    // adds any positive amount
    player.addResource(Resources.MEGACREDITS, 12);
    expect(player.megaCredits).eq(22);
    // removes more than we have
    player.addResource(Resources.MEGACREDITS, -23);
    expect(player.megaCredits).eq(0);
    // adds any positive amount
    player.addResource(Resources.MEGACREDITS, 5);
    expect(player.megaCredits).eq(5);
    // removes less than we have
    player.addResource(Resources.MEGACREDITS, -4);
    expect(player.megaCredits).eq(1);
    // makes no change
    player.addResource(Resources.MEGACREDITS, 0);
    expect(player.megaCredits).eq(1);
  });

  it('addResource logging', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);

    const log = game.gameLog;
    log.length = 0; // Empty it out.

    player.addResource(Resources.MEGACREDITS, 12, {log: false});
    expect(log.length).eq(0);

    player.addResource(Resources.MEGACREDITS, 12, {log: true});
    const logEntry = log[0];
    expect(TestingUtils.formatLogMessage(logEntry)).eq('blue\'s megacredits amount increased by 12');
  });

  it('addResource logging from player', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    player.megaCredits = 5;
    player.addResource(Resources.MEGACREDITS, -5, {log: true, from: player2});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(TestingUtils.formatLogMessage(logEntry)).eq('blue\'s megacredits amount decreased by 5 by red');
  });

  it('addResource logging from global event', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);

    player.addResource(Resources.MEGACREDITS, 12, {log: true, from: GlobalEventName.ASTEROID_MINING});

    const log = game.gameLog;
    const logEntry = log[log.length - 1];
    expect(TestingUtils.formatLogMessage(logEntry)).eq('blue\'s megacredits amount increased by 12 by Global Event');
  });

  it('addResource logs error when deducting too much', () => {
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    player.megaCredits = 10;
    const warn = console.warn;
    const consoleLog: Array<Array<any>> = [];
    console.warn = (message?: any, ...optionalParams: any[]) => {
      consoleLog.push([message, optionalParams]);
    };
    player.addResource(Resources.MEGACREDITS, -12);
    console.warn = warn;

    expect(consoleLog.length).eq(1);
    expect(consoleLog[0][0]).eq('Illegal state: Adjusting -12 megacredits when player has 10');
    expect(JSON.parse(consoleLog[0][1])).deep.eq(
      {
        'gameId': 'foobar',
        'lastSaveId': 0,
        'logAge': 7,
        'currentPlayer': 'p-blue-id',
        'metadata': {
          'player': {
            'color': 'blue',
            'id': 'p-blue-id',
            'name': 'player-blue',
          },
          'resource': 'megacredits',
          'amount': -12,
        },
      });
  });
});

function waitingForGlobalParameters(player: Player): Array<GlobalParameter> {
  return player.getWaitingFor()!.options!.map((o) => o.title as string).map(titlesToGlobalParameter);
}

function titlesToGlobalParameter(title: string): GlobalParameter {
  if (title.includes('temperature')) {
    return GlobalParameter.TEMPERATURE;
  }
  if (title.includes('ocean')) {
    return GlobalParameter.OCEANS;
  }
  if (title.includes('oxygen')) {
    return GlobalParameter.OXYGEN;
  }
  if (title.includes('Venus')) {
    return GlobalParameter.VENUS;
  }
  if (title.includes('colony')) {
    return GlobalParameter.MOON_COLONY_RATE;
  }
  if (title.includes('mining')) {
    return GlobalParameter.MOON_MINING_RATE;
  }
  if (title.includes('logistics')) {
    return GlobalParameter.MOON_LOGISTICS_RATE;
  }
  throw new Error('title does not match any description: ' + title);
}
