
import {expect} from 'chai';
import {LunarBeam} from '../src/cards/base/LunarBeam';
import {Game} from '../src/Game';
import {Insulation} from '../src/cards/base/Insulation';
import {IoMiningIndustries} from '../src/cards/base/IoMiningIndustries';
import {PowerSupplyConsortium} from '../src/cards/base/PowerSupplyConsortium';
import {SaturnSystems} from '../src/cards/corporation/SaturnSystems';
import {SelectOption} from '../src/inputs/SelectOption';
import {Resources} from '../src/Resources';
import {TestPlayers} from './TestingUtils';

describe('Player', function() {
  it('should initialize with right defaults', function() {
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.corporationCard).is.undefined;
  });
  it('Should throw error if nothing to process', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
    (player as any).setWaitingFor(undefined, undefined);
    expect(function() {
      player.process(game, []);
    }).to.throw('Not waiting for anything');
  });
  it('Should run select player for PowerSupplyConsortium', function() {
    const card = new PowerSupplyConsortium();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const player3 = TestPlayers.YELLOW.newPlayer();
    const game = new Game('foobar', [player, player2, player3], player);
    player2.addProduction(Resources.ENERGY, 2);
    player3.addProduction(Resources.ENERGY, 2);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new LunarBeam());
    const action = card.play(player, new Game('foobar', [player, player2, player3], player));
    if (action !== undefined) {
      player.setWaitingFor(action, () => undefined);
      player.process(game, [[player2.id]]);
      expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    }
  });
  it('Should error with input for run select player for PowerSupplyConsortium', function() {
    const card = new PowerSupplyConsortium();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new LunarBeam());
    const action = card.play(player, new Game('foobar', [player, player], player));
    if (action !== undefined) {
      player.setWaitingFor(action, () => undefined);
      expect(player.getWaitingFor()).is.not.undefined;
      expect(function() {
        player.process(game, [[]]);
      }).to.throw('Invalid players array provided');
      expect(function() {
        player.process(game, []);
      }).to.throw('Incorrect options provided');
      expect(function() {
        player.process(game, [['bar']]);
      }).to.throw('Player not available');
    }
  });
  it('Should run select amount for Insulation', function() {
    const card = new Insulation();
    const player = TestPlayers.BLUE.newPlayer();
    player.addProduction(Resources.HEAT, 2);
    const game = new Game('foobar', [player], player);
    const action = card.play(player, new Game('foobar', [player, player], player));
    expect(action).is.not.undefined;
    if (action === undefined) return;
    player.setWaitingFor(action, () => undefined);
    expect(player.getWaitingFor()).is.not.undefined;
    expect(function() {
      player.process(game, [[]]);
    }).to.throw('Incorrect options provided');
    expect(function() {
      player.process(game, []);
    }).to.throw('Incorrect options provided');
    expect(function() {
      player.process(game, [['foobar']]);
    }).to.throw('Number not provided for amount');
    player.process(game, [['1']]);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getWaitingFor()).is.undefined;
  });
  it('Runs SaturnSystems when other player plays card', function() {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = new Game('gto', [player1, player2], player1);
    const card = new IoMiningIndustries();
    const corporationCard = new SaturnSystems();
    expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(0);
    player1.corporationCard = corporationCard;
    player2.playCard(game, card, undefined);
    expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
  it('Chains onend functions from player inputs', function(done) {
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
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
    player.process(game, [['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process(game, [['1']]);
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process(game, [['1']]);
    expect(player.getWaitingFor()).to.be.undefined;
  });
  it('serializes every property', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const serialized = player.serialize();
    const serializedKeys = Object.keys(serialized);
    const playerKeys = Object.keys(player);
    serializedKeys.sort();
    playerKeys.sort();
    expect(serializedKeys).to.deep.eq(playerKeys);
  });
});
