import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';

describe('AsteroidMining', function() {
  it('Should play', function() {
    const card = new AsteroidMining();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
