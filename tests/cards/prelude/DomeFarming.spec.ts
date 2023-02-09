import {expect} from 'chai';
import {DomeFarming} from '../../../src/server/cards/prelude/DomeFarming';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
