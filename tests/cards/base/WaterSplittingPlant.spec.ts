import {expect} from 'chai';
import {WaterSplittingPlant} from '../../../src/cards/base/WaterSplittingPlant';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('WaterSplittingPlant', function() {
  let card : WaterSplittingPlant; let player : Player; let game : Game;

  beforeEach(function() {
    card = new WaterSplittingPlant();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', function() {
    TestingUtils.maxOutOceans(player, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Can\'t act', function() {
    player.energy = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
