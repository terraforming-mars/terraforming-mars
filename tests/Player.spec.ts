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
      player.setWaitingFor(action, () => undefined);
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
      player.setWaitingFor(action, () => undefined);
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
    player.setWaitingFor(action, () => undefined);
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
    player.setWaitingFor(mockOption, () => done());
    player.process([['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process([['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process([['1']]);
    expect(player.getWaitingFor()).to.be.undefined;
  });
  it('serialization test for pickedCorporationCard', () => {
    const player = TestPlayers.BLUE.newPlayer();
    player.pickedCorporationCard = new SaturnSystems();
    const json = player.serialize();
    expect(json.pickedCorporationCard).eq('Saturn Systems');
  });
  it('serialization test', () => {
    const json = {
      id: 'blue-id',
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
      usedUndo: false,
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
});
