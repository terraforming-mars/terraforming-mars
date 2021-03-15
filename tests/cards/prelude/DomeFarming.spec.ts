import {expect} from 'chai';
import {DomeFarming} from '../../../src/cards/prelude/DomeFarming';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
