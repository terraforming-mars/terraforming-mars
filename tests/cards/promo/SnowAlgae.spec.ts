import {expect} from 'chai';
import {SnowAlgae} from '../../../src/server/cards/promo/SnowAlgae';
import {maxOutOceans, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SnowAlgae', function() {
  let card: SnowAlgae;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SnowAlgae();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    maxOutOceans(player, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});
