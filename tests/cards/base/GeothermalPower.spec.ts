import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';
import {cast} from '../../TestingUtils';

describe('GeothermalPower', () => {
  it('Should play', () => {
    const card = new GeothermalPower();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(2);
  });
});
