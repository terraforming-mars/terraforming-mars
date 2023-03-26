import {expect} from 'chai';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {OptimalAerobraking} from '../../../src/server/cards/base/OptimalAerobraking';
import {testGame} from '../../TestGame';

describe('OptimalAerobraking', function() {
  it('Should play', function() {
    const card = new OptimalAerobraking();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.onCardPlayed(player, card)).is.undefined;
    expect(card.onCardPlayed(player, new BigAsteroid())).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
