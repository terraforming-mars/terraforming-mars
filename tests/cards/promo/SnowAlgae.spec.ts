import {expect} from 'chai';
import {SnowAlgae} from '../../../src/server/cards/promo/SnowAlgae';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SnowAlgae', function() {
  let card: SnowAlgae;
  let player: Player;

  beforeEach(function() {
    card = new SnowAlgae();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not play', function() {
    maxOutOceans(player, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});
