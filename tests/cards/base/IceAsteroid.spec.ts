import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
