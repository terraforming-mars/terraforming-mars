import {expect} from 'chai';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SisterPlanetSupport', function() {
  it('Should play', function() {
    const card = new SisterPlanetSupport();
    const player = TestPlayers.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
