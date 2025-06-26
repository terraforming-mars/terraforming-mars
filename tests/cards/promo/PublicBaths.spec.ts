import {expect} from 'chai';
import {PublicBaths} from '../../../src/server/cards/promo/PublicBaths';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('PublicBaths', () => {
  let card: PublicBaths;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PublicBaths();
    [, player] = testGame(1);
  });

  it('Cannot play', () => {
    maxOutOceans(player, 5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 6);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    card.play(player);
    expect(player.megaCredits).eq(6);
  });
});
