import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Mine} from '../../../src/server/cards/base/Mine';
import {cast} from '../../TestingUtils';

describe('Mine', () => {
  it('Should play', () => {
    const card = new Mine();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.steel).to.eq(1);
  });
});
