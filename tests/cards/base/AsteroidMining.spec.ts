
import {expect} from 'chai';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('AsteroidMining', function() {
  it('Should play', function() {
    const card = new AsteroidMining();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
