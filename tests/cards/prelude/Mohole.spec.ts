import {expect} from 'chai';
import {Mohole} from '../../../src/server/cards/prelude/Mohole';
import {testGame} from '../../TestGame';

describe('Mohole', function() {
  it('Should play', function() {
    const card = new Mohole();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
