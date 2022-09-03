import {expect} from 'chai';
import {MetalsCompany} from '../../../src/server/cards/prelude/MetalsCompany';
import {TestPlayer} from '../../TestPlayer';

describe('MetalsCompany', function() {
  it('Should play', function() {
    const card = new MetalsCompany();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player.production.steel).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });
});
