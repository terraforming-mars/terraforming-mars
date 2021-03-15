import {expect} from 'chai';
import {BigAsteroid} from '../../../src/cards/base/BigAsteroid';
import {OptimalAerobraking} from '../../../src/cards/base/OptimalAerobraking';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('OptimalAerobraking', function() {
  it('Should play', function() {
    const card = new OptimalAerobraking();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.onCardPlayed(player, card)).is.undefined;
    expect(card.onCardPlayed(player, new BigAsteroid())).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
