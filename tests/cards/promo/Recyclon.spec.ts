import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Recyclon} from '../../../src/server/cards/promo/Recyclon';
import {runAllActions} from '../../TestingUtils';

describe('Recyclon', function() {
  it('Should play', function() {
    const card = new Recyclon();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const play = card.play(player);
    runAllActions(game);
    expect(play).is.undefined;
    expect(player.production.steel).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });
});
