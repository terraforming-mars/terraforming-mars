
import {expect} from 'chai';
import {Sponsors} from '../../../src/cards/base/Sponsors';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
