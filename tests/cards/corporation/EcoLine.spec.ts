import {expect} from 'chai';
import {EcoLine} from '../../../src/cards/corporation/EcoLine';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EcoLine', function() {
  it('Should play', function() {
    const card = new EcoLine();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.plants).to.eq(3);
    expect(player.plantsNeededForGreenery).to.eq(7);
  });
});
