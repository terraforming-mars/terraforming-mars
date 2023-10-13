import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AdaptedLichen} from '../../../src/server/cards/base/AdaptedLichen';

describe('AdaptedLichen', function() {
  it('Should play', function() {
    const card = new AdaptedLichen();
    const [/* skipped */, player] = testGame(1);

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
