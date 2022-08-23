import {expect} from 'chai';
import {AdaptedLichen} from '../../../src/server/cards/base/AdaptedLichen';
import {TestPlayer} from '../../TestPlayer';

describe('AdaptedLichen', function() {
  it('Should play', function() {
    const card = new AdaptedLichen();
    const player = TestPlayer.BLUE.newPlayer();

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
