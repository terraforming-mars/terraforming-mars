
import {expect} from 'chai';
import {Soletta} from '../../../src/server/cards/base/Soletta';
import {testGame} from '../../TestGame';

describe('Soletta', function() {
  it('Should play', function() {
    const card = new Soletta();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(7);
  });
});
