import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {testGame} from '../../TestGame';
import {cast, maxOutOceans, testRedsCosts} from '../../TestingUtils';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });

  it('Works with reds', () => {
    const card = new IceAsteroid();
    const [/* game */, player, player2] = testGame(2, {turmoilExtension: true});

    testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
    maxOutOceans(player2, 8);
    testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
    maxOutOceans(player2, 9);
    testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  });
});
