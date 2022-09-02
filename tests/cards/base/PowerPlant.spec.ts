import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {TestPlayer} from '../../TestPlayer';

describe('PowerPlant', function() {
  it('Should play', function() {
    const card = new PowerPlant();
    const player = TestPlayer.BLUE.newPlayer();
    expect(card.play(player)).is.undefined;
    expect(player.production.energy).to.eq(1);
  });
});
