import {expect} from 'chai';
import {LunarBeam} from '../src/server/cards/base/LunarBeam';
import {Game} from '../src/server/Game';
import {Insulation} from '../src/server/cards/base/Insulation';
import {IoMiningIndustries} from '../src/server/cards/base/IoMiningIndustries';
import {PowerSupplyConsortium} from '../src/server/cards/base/PowerSupplyConsortium';
import {SaturnSystems} from '../src/server/cards/corporation/SaturnSystems';
import {SelectOption} from '../src/server/inputs/SelectOption';
import {Resource} from '../src/common/Resource';
import {SerializedPlayer} from '../src/server/SerializedPlayer';
import {SerializedTimer} from '../src/common/SerializedTimer';
import {Player} from '../src/server/Player';
import {Color} from '../src/common/Color';
import {CardName} from '../src/common/cards/CardName';
import {cast, doWait, getSendADelegateOption, runAllActions} from './TestingUtils';
import {SelfReplicatingRobots} from '../src/server/cards/promo/SelfReplicatingRobots';
import {IProjectCard} from '../src/server/cards/IProjectCard';
import {Pets} from '../src/server/cards/base/Pets';
import {TestPlayer} from './TestPlayer';
import {SelectParty} from '../src/server/inputs/SelectParty';
import {PartyName} from '../src/common/turmoil/PartyName';
import {InputResponse} from '../src/common/inputs/InputResponse';
import {SelectPlayer} from '../src/server/inputs/SelectPlayer';
import {SelectAmount} from '../src/server/inputs/SelectAmount';
import {Phase} from '../src/common/Phase';
import {testGame} from './TestGame';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {AlliedBanks} from '../src/server/cards/prelude/AlliedBanks';
import {Biofuels} from '../src/server/cards/prelude/Biofuels';
import {CO2Reducers} from '../src/server/cards/pathfinders/CO2Reducers';
import {Donation} from '../src/server/cards/prelude/Donation';
import {Loan} from '../src/server/cards/prelude/Loan';
import {IPreludeCard} from '../src/server/cards/prelude/IPreludeCard';
import {OrOptions} from '../src/server/inputs/OrOptions';
import {Payment} from '../src/common/inputs/Payment';
import {PhysicsComplex} from '../src/server/cards/base/PhysicsComplex';
import {GlobalParameter} from '../src/common/GlobalParameter';
import {EnergyTapping} from '../src/server/cards/base/EnergyTapping';

describe('Player', () => {
  it('should initialize with right defaults', () => {
    const player = new Player('name', 'blue', false, 0, 'p-blue');
    expect(player.corporations).is.empty;
  });

  it('Should throw error if nothing to process', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player);
    (player as any).setWaitingFor(undefined, undefined);

    expect(() => player.process({type: 'option'})).to.throw('Not waiting for anything');
  });

  it('Should run select player for PowerSupplyConsortium', () => {
    const card = new PowerSupplyConsortium();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    const player3 = new Player('yellow', 'yellow', false, 0, 'p-yellow');
    Game.newInstance('gameid', [player, player2, player3], player);
    player2.production.add(Resource.ENERGY, 2);
    player3.production.add(Resource.ENERGY, 2);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new EnergyTapping());
    card.play(player);
    runAllActions(player.game);
    player.process({type: 'player', player: player2.color});
    expect(player.production.energy).to.eq(1);
  });

  it('Should error with input for run select player for PowerSupplyConsortium', () => {
    const card = new PowerSupplyConsortium();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gameid', [player, player2], player);
    (player as any).setWaitingFor(undefined, undefined);

    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new EnergyTapping());
    player.production.add(Resource.ENERGY, 1);
    player2.production.add(Resource.ENERGY, 1);

    cast(card.play(player), undefined);
    runAllActions(player.game);
    cast(player.getWaitingFor(), SelectPlayer);

    expect(() => player.process({} as InputResponse)).to.throw(/Not a valid SelectPlayerResponse/);
    expect(() => player.process({type: 'option'})).to.throw(/Not a valid SelectPlayerResponse/);
    expect(() => player.process({type: 'player', player: 'yellow'})).to.throw(/Player not available/);
  });

  it('Should run select amount for Insulation', () => {
    const card = new Insulation();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const redPlayer = new Player('red', 'red', false, 0, 'p-red');

    player.production.add(Resource.HEAT, 2);
    Game.newInstance('gameid', [player, redPlayer], player);
    player.defer(card.play(player));
    runAllActions(player.game);
    cast(player.getWaitingFor(), SelectAmount);

    expect(() => player.process({} as InputResponse)).to.throw(/Not a valid SelectAmountResponse/);
    expect(() => player.process({type: 'amount', amount: 'foobar' as unknown as number})).to.throw(/Amount is not a number/);
    player.process({type: 'amount', amount: 1});
    expect(player.production.heat).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
    cast(player.getWaitingFor(), undefined);
  });
  it('Runs SaturnSystems when other player plays card', () => {
    const player1 = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gto', [player1, player2], player1);
    const card = new IoMiningIndustries();
    const corporationCard = new SaturnSystems();
    expect(player1.production.megacredits).to.eq(0);
    player1.corporations = [corporationCard];
    player2.playCard(card, undefined);
    expect(player1.production.megacredits).to.eq(1);
  });
  it('Chains onend functions from player inputs', function(done) {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player);
    const mockOption3 = new SelectOption('Mock select option 3').andThen(() => {
      return undefined;
    });
    const mockOption2 = new SelectOption('Mock select option 2').andThen(() => {
      return mockOption3;
    });
    const mockOption = new SelectOption('Mock select option').andThen(() => {
      return mockOption2;
    });
    player.setWaitingFor(mockOption, done);
    player.process({type: 'option'});
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process({type: 'option'});
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process({type: 'option'});
    expect(player.getWaitingFor()).to.be.undefined;
  });
  it('Omits buffer gas for non solo games', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2= new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gameid', [player, player2], player);
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).to.be.undefined;
  });
  it('Omit buffer gas for solo games without 63 TR', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player);
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).to.be.undefined;
  });

  it('Include buffer gas for solo games with 63 TR', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player, {soloTR: true});
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find((card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT);
    expect(bufferGas).not.to.be.undefined;
  });

  it('serialization test for pickedCorporationCard', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    player.pickedCorporationCard = new SaturnSystems();
    const json = player.serialize();
    expect(json.pickedCorporationCard).eq('Saturn Systems');
  });
  it('serialization test', () => {
    const json: SerializedPlayer = {
      id: 'p-blue',
      autoPass: false,
      pickedCorporationCard: CardName.THARSIS_REPUBLIC,
      terraformRating: 20,
      corporations: [],
      hasIncreasedTerraformRatingThisGeneration: false,
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
      canUseCorruptionAsMegacredits: true,
      canUseHeatAsMegaCredits: false,
      canUseTitaniumAsMegacredits: false,
      canUsePlantsAsMegaCredits: false,
      actionsTakenThisRound: 15,
      actionsTakenThisGame: 30,
      actionsThisGeneration: [CardName.FACTORUM, CardName.GHG_PRODUCING_BACTERIA],
      pendingInitialActions: [],
      dealtCorporationCards: [CardName.THARSIS_REPUBLIC],
      dealtCeoCards: [CardName.KAREN],
      dealtProjectCards: [CardName.FLOATER_LEASING, CardName.BUTTERFLY_EFFECT],
      dealtPreludeCards: [CardName.MOHOLE_EXCAVATION, CardName.LAVA_TUBE_SETTLEMENT],
      cardsInHand: [CardName.EARTH_ELEVATOR, CardName.DUST_SEALS],
      preludeCardsInHand: [CardName.METAL_RICH_ASTEROID, CardName.PSYCHROPHILES],
      ceoCardsInHand: [],
      playedCards: [], // TODO(kberg): these are SerializedCard.
      draftedCards: [CardName.FISH, CardName.EXTREME_COLD_FUNGUS],
      needsToDraft: false,
      cardCost: 3,
      cardDiscount: 7,
      fleetSize: 99,
      tradesThisGeneration: 100,
      colonyTradeOffset: 101,
      colonyTradeDiscount: 102,
      colonyVictoryPoints: 104,
      turmoilPolicyActionUsed: false,
      politicalAgendasActionUsedCount: 0,
      hasTurmoilScienceTagBonus: false,
      preservationProgram: false,
      oceanBonus: 86,
      scienceTagCount: 97,
      plantsNeededForGreenery: 5,
      removingPlayers: [],
      removedFromPlayCards: [],
      name: 'p-blue',
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
      totalDelegatesPlaced: 0,
      victoryPointsByGeneration: [],
      underworldData: {corruption: 0},
      alliedParty: {agenda: {bonusId: 'gb01', policyId: 'gp01'}, partyName: PartyName.GREENS},
      draftHand: [],
      globalParameterSteps: {
        [GlobalParameter.OCEANS]: 0,
        [GlobalParameter.OXYGEN]: 0,
        [GlobalParameter.TEMPERATURE]: 0,
        [GlobalParameter.VENUS]: 0,
        [GlobalParameter.MOON_HABITAT_RATE]: 0,
        [GlobalParameter.MOON_MINING_RATE]: 0,
        [GlobalParameter.MOON_LOGISTICS_RATE]: 0,
      },
      standardProjectsThisGeneration: [],
    };

    const newPlayer = Player.deserialize(json);

    expect(newPlayer.color).eq('purple');
    expect(newPlayer.colonies.tradesThisGeneration).eq(100);
    expect(newPlayer.canUseCorruptionAsMegacredits).eq(true);
    it('pulls self replicating robots target cards', () => {
      const player = new Player('blue', 'blue', false, 0, 'p-blue');
      expect(player.getSelfReplicatingRobotsTargetCards()).is.empty;
      const srr = new SelfReplicatingRobots();
      player.playedCards.push(srr);
      srr.targetCards.push(new LunarBeam());
      expect(player.getSelfReplicatingRobotsTargetCards()).has.length(1);
    });
    it('removes tags from card played from self replicating robots', () => {
      const player = TestPlayer.BLUE.newPlayer();
      Game.newInstance('gameid', [player], player);
      const srr = new SelfReplicatingRobots();
      player.stock.megacredits = 10;
      player.playedCards.push(srr);
      const physicsComplex = new PhysicsComplex();
      player.cardsInHand.push(physicsComplex);
      const action = cast(srr.action(player), OrOptions);
      action.options[0].cb([cast(action.options[0], SelectCard<IProjectCard>).cards[0]]);
      expect(srr.targetCards[0].resourceCount).to.eq(2);
      player.playCard(physicsComplex, Payment.of({'megaCredits': 10}));
      expect(player.playedCards).to.contain(physicsComplex);
      expect(physicsComplex.resourceCount).to.eq(0);
    });

    it('addResourceTo', () => {
      const player = new Player('blue', 'blue', false, 0, 'p-blue');
      const game = Game.newInstance('gameid', [player], player);

      const log = game.gameLog;

      log.length = 0; // Empty it out.

      const card = new Pets();
      expect(card.resourceCount).eq(0);
      expect(log).is.empty;

      player.addResourceTo(card);
      expect(card.resourceCount).eq(1);
      expect(log).is.empty;

      player.addResourceTo(card, 1);
      expect(card.resourceCount).eq(2);
      expect(log).is.empty;

      player.addResourceTo(card, 3);
      expect(card.resourceCount).eq(5);
      expect(log).is.empty;

      player.addResourceTo(card, {qty: 3, log: true});
      expect(log).has.length(1);
      const logEntry = log[0];
      expect(logEntry.data[1].value).eq('3');
      expect(logEntry.data[3].value).eq('Pets');
    });

    it('addResourceTo with Mons Insurance hook does not remove when no credits', () => {
      const player1 = new Player('blue', 'blue', false, 0, 'p-blue');
      const player2 = new Player('red', 'red', false, 0, 'p-red');
      const game = Game.newInstance('gameid', [player1, player2], player1);
      player1.megaCredits = 0;
      player1.production.add(Resource.MEGACREDITS, -5);
      player2.megaCredits = 3;
      game.monsInsuranceOwner = player2.id;
      player1.stock.add(Resource.MEGACREDITS, -3, {from: player2, log: false});
      expect(player2.megaCredits).eq(3);
      player1.production.add(Resource.MEGACREDITS, -3, {from: player2, log: false});
      expect(player2.megaCredits).eq(3);
    });

    it('removeResourcesFrom', () => {
      const player = new Player('blue', 'blue', false, 0, 'p-blue');
      const game = Game.newInstance('gameid', [player], player);

      const log = game.gameLog;
      log.length = 0; // Empty it out.

      const card = new Pets();
      expect(card.resourceCount).eq(0);
      expect(log).is.empty;

      log.length = 0;
      card.resourceCount = 6;
      player.removeResourceFrom(card);
      expect(card.resourceCount).eq(5);
      expect(log).has.length(1);
      expect(log[0].data[1].value).eq('1');
      expect(log[0].data[3].value).eq('Pets');

      log.length = 0;
      player.removeResourceFrom(card, 1);
      expect(card.resourceCount).eq(4);
      expect(log).has.length(1);
      expect(log[0].data[1].value).eq('1');

      log.length = 0;
      player.removeResourceFrom(card, 3);
      expect(log).has.length(1);
      expect(log[0].data[1].value).eq('3');

      log.length = 0;
      card.resourceCount = 4;
      player.removeResourceFrom(card, 5);
      expect(card.resourceCount).eq(0);
      expect(log).has.length(1);
      expect(log[0].data[1].value).eq('4');
    });

    it('Turmoil player action', () => {
      const player = TestPlayer.BLUE.newPlayer();

      const game = Game.newInstance('gameid', [player], player, {turmoilExtension: true});

      const turmoil = game.turmoil!;

      expect(turmoil.usedFreeDelegateAction.has(player)).is.false;

      const freeLobbyAction = cast(getSendADelegateOption(player), SelectParty);

      expect(freeLobbyAction.title).eq('Send a delegate in an area (from lobby)');
      expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player)).eq(0);

      freeLobbyAction.cb(PartyName.KELVINISTS);
      runAllActions(game);

      expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player)).eq(1);

      // Now the free lobby action is used, only the 5MC option is available.
      player.megaCredits = 4;
      expect(turmoil.usedFreeDelegateAction.has(player)).is.true;
      expect(getSendADelegateOption(player)).is.undefined;

      player.megaCredits = 5;
      const selectParty = cast(getSendADelegateOption(player), SelectParty);

      expect(selectParty.title).eq('Send a delegate in an area (5 M€)');

      selectParty.cb(PartyName.KELVINISTS);
      runAllActions(game);

      expect(player.megaCredits).eq(0);
      expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(player)).eq(2);
    });

    it('Prelude action cycle', () => {
      const [game, player1, player2] = testGame(2, {preludeExtension: true});

      // None of these preludes require additional user input, so they're good for this test.
      const alliedBanks = new AlliedBanks();
      const biofuels = new Biofuels();
      const co2Reducers = new CO2Reducers();
      const donation = new Donation();

      game.phase = Phase.PRELUDES;
      player1.preludeCardsInHand = [alliedBanks, biofuels];
      player2.preludeCardsInHand = [co2Reducers, donation];

      expect(player1.actionsTakenThisRound).eq(0);
      expect(game.activePlayer).eq(player1.id);

      player1.takeAction();

      doWait(player1, SelectCard, (firstPrelude) => {
        expect(firstPrelude!.title).eq('Select prelude card to play');
        firstPrelude.cb([alliedBanks]);
      });
      runAllActions(game);

      expect(game.activePlayer).eq(player1.id);
      expect(player2.getWaitingFor()).is.undefined;

      doWait(player1, SelectCard, (selectCard) => {
        expect(selectCard.title).eq('Select prelude card to play');
        selectCard.cb([biofuels]);
      });
      runAllActions(game);

      expect(game.activePlayer).eq(player2.id);
      expect(player1.getWaitingFor()).is.undefined;

      doWait(player2, SelectCard, (firstPrelude) => {
        expect(firstPrelude!.title).eq('Select prelude card to play');
        firstPrelude.cb([co2Reducers]);
      });
      runAllActions(game);

      expect(game.activePlayer).eq(player2.id);
      expect(player1.getWaitingFor()).is.undefined;

      doWait(player2, SelectCard, (selectCard) => {
        expect(selectCard.title).eq('Select prelude card to play');
        selectCard.cb([donation]);
      });

      runAllActions(game);

      expect(game.phase).eq(Phase.ACTION);
      expect(game.activePlayer).eq(player1.id);
      expect(player2.getWaitingFor()).is.undefined;
    });

    it('Prelude fizzle', () => {
      const [game, player] = testGame(1, {preludeExtension: true});

      const alliedBanks = new AlliedBanks();
      const loan = new Loan();

      game.phase = Phase.PRELUDES;
      player.preludeCardsInHand = [alliedBanks, loan];

      player.production.override({megacredits: -5});

      player.takeAction();
      runAllActions(game);

      const selectCard = cast(player.popWaitingFor(), SelectCard<IPreludeCard>);
      expect(selectCard.cards).deep.eq([alliedBanks, loan]);
      expect(loan.canPlay(player)).is.false;
      selectCard.cb([loan]);
      runAllActions(game);

      expect(player.megaCredits).eq(15);
      expect(player.preludeCardsInHand).deep.eq([alliedBanks]);
    });

    it('autopass', () => {
      const [game, player, player2] = testGame(2);

      game.phase = Phase.ACTION;

      player.autopass = true;
      player.takeAction();
      expect(game.activePlayer).eq(player2.id);
    });
  });

  // it('everybody autopasses', () => {
  //   const [game, player, player2] = testGame(2);

  //   game.phase = Phase.ACTION;

  //   player.autopass = true;
  //   player2.autopass = true;
  //   player.takeAction();

  //   expect(game.phase).eq(Phase.RESEARCH);
  //   expect(player.autopass).is.false;
  //   expect(player2.autopass).is.false;
  // });

  it('Increasing temperature sets globalParameterSteps', () => {
    const [game, player, player2] = testGame(2, {solarPhaseOption: true});

    game.phase = Phase.ACTION;
    game.increaseTemperature(player, 1);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(1);

    game.increaseTemperature(player, 2);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(3);

    game.increaseTemperature(player, -1);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(3);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(0);

    game.phase = Phase.SOLAR;

    game.increaseTemperature(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(0);

    game.phase = Phase.ACTION;

    game.increaseTemperature(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(2);
  });

  it('Increasing oxygen sets globalParameterSteps', () => {
    const [game, player, player2] = testGame(2, {solarPhaseOption: true});

    game.phase = Phase.ACTION;
    game.increaseOxygenLevel(player, 1);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(1);

    game.increaseOxygenLevel(player, 2);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(3);

    game.increaseOxygenLevel(player, -1);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(3);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(0);

    game.phase = Phase.SOLAR;

    game.increaseOxygenLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(0);

    game.phase = Phase.ACTION;

    game.increaseOxygenLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(2);
  });
});

