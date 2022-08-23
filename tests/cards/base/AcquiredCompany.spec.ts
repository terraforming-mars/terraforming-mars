import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {TestPlayer} from '../../TestPlayer';

describe('AcquiredCompany', function() {
  it('Should play', function() {
    const card = new AcquiredCompany();
    const player = TestPlayer.BLUE.newPlayer();

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
