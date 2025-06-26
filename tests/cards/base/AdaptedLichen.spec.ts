import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AdaptedLichen} from '../../../src/server/cards/base/AdaptedLichen';

describe('AdaptedLichen', () => {
  it('Should play', () => {
    const card = new AdaptedLichen();
    const [/* game */, player] = testGame(1);

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
