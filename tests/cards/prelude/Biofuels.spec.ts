import {expect} from 'chai';
import {Biofuels} from '../../../src/cards/prelude/Biofuels';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Biofuels', function() {
  it('Should play', function() {
    const card = new Biofuels();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.plants).to.eq(2);
  });
});
