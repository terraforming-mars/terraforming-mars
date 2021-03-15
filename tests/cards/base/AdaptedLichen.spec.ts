
import {expect} from 'chai';
import {AdaptedLichen} from '../../../src/cards/base/AdaptedLichen';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AdaptedLichen', function() {
  it('Should play', function() {
    const card = new AdaptedLichen();
    const player = TestPlayers.BLUE.newPlayer();

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
