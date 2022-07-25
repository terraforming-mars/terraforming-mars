
import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/cards/base/AcquiredCompany';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayer';

describe('AcquiredCompany', function() {
  it('Should play', function() {
    const card = new AcquiredCompany();
    const player = TestPlayers.BLUE.newPlayer();

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
