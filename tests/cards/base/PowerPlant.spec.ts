import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PowerPlant', () => {
  it('Should play', () => {
    const card = new PowerPlant();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
  });
});
