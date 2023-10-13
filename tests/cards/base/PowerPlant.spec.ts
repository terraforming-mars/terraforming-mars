import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {testGame} from '../../TestGame';

describe('PowerPlant', function() {
  it('Should play', function() {
    const card = new PowerPlant();
    const [/* skipped */, player] = testGame(1);
    expect(card.play(player)).is.undefined;
    expect(player.production.energy).to.eq(1);
  });
});
