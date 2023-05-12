import {expect} from 'chai';
import {SocietySupport} from '../../../src/server/cards/prelude/SocietySupport';
import {testGame} from '../../TestGame';

describe('SocietySupport', function() {
  it('Should play', function() {
    const [, player] = testGame(1);
    const card = new SocietySupport();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(1);
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});
