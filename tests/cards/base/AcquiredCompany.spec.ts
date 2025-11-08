import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';

describe('AcquiredCompany', () => {
  it('Should play', () => {
    const card = new AcquiredCompany();
    const [/* game */, player] = testGame(1);

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
