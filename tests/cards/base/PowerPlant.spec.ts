import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('PowerPlant', function() {
  it('Should play', function() {
    const card = new PowerPlant();
    const player = TestPlayer.BLUE.newPlayer();
    expect(card.play(player)).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
