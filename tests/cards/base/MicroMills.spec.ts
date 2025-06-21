import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MicroMills', () => {
  it('Should play', () => {
    const card = new MicroMills();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);

    expect(player.production.heat).to.eq(1);
  });
});
