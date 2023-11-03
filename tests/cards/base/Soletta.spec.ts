
import {expect} from 'chai';
import {Soletta} from '../../../src/server/cards/base/Soletta';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Soletta', function() {
  it('Should play', function() {
    const card = new Soletta();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(7);
  });
});
