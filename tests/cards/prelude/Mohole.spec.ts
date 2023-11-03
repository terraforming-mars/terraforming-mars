import {expect} from 'chai';
import {Mohole} from '../../../src/server/cards/prelude/Mohole';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Mohole', function() {
  it('Should play', function() {
    const card = new Mohole();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
