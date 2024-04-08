import {expect} from 'chai';
import {SocietySupport} from '../../../src/server/cards/prelude/SocietySupport';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SocietySupport', function() {
  it('Should play', function() {
    const [/* game */, player] = testGame(1);
    const card = new SocietySupport();
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(1);
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });
});
