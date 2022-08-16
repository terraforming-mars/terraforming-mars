import {expect} from 'chai';
import {Recyclon} from '../../../src/server/cards/promo/Recyclon';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Recyclon', function() {
  it('Should play', function() {
    const card = new Recyclon();
    const player = TestPlayer.BLUE.newPlayer();
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });
});
