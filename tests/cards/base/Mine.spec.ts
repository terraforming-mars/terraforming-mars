import {expect} from 'chai';
import {Mine} from '../../../src/cards/base/Mine';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
