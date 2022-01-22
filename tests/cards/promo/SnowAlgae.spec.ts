import {expect} from 'chai';
import {SnowAlgae} from '../../../src/cards/promo/SnowAlgae';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('SnowAlgae', function() {
  let card : SnowAlgae; let player : Player;

  beforeEach(function() {
    card = new SnowAlgae();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    TestingUtils.maxOutOceans(player, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
