import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';

describe('AsteroidMining', function() {
  it('Should play', function() {
    const card = new AsteroidMining();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
