import {expect} from 'chai';
import {PeroxidePower} from '../../../src/cards/base/PeroxidePower';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('PeroxidePower', function() {
  it('Should play', function() {
    const card = new PeroxidePower();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
