import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {cast} from '../../TestingUtils';

describe('AsteroidMining', function() {
  it('Should play', function() {
    const card = new AsteroidMining();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
