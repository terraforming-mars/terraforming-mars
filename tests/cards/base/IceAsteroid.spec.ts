import {expect} from 'chai';
import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {testGame} from '../../TestGame';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const [, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
