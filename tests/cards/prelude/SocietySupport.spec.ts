import {expect} from 'chai';
import {SocietySupport} from '../../../src/server/cards/prelude/SocietySupport';
import {TestPlayer} from '../../TestPlayer';

describe('SocietySupport', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const card = new SocietySupport();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(1);
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});
