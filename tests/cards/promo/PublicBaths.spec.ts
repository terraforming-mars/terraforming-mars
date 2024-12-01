import {expect} from 'chai';
import {PublicBaths} from '../../../src/server/cards/promo/PublicBaths';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('PublicBaths', function() {
  let card: PublicBaths;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PublicBaths();
    [, player] = testGame(1);
  });

  it('Cannot play', function() {
    maxOutOceans(player, 5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 6);
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    card.play(player);
    expect(player.megaCredits).eq(6);
  });
});
