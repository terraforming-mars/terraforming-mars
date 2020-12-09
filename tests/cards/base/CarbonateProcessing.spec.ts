import {expect} from 'chai';
import {CarbonateProcessing} from '../../../src/cards/base/CarbonateProcessing';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('CarbonateProcessing', function() {
  let card : CarbonateProcessing; let player : Player;

  beforeEach(function() {
    card = new CarbonateProcessing();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
  });
});
