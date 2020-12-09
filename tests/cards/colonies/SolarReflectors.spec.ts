import {expect} from 'chai';
import {SolarReflectors} from '../../../src/cards/colonies/SolarReflectors';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('SolarReflectors', function() {
  it('Should play', function() {
    const card = new SolarReflectors();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(5);
  });
});
