import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Mine} from '../../../src/server/cards/base/Mine';
import {cast} from '../../TestingUtils';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const [/* skipped */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.steel).to.eq(1);
  });
});
