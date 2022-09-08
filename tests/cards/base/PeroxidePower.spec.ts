import {expect} from 'chai';
import {PeroxidePower} from '../../../src/server/cards/base/PeroxidePower';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PeroxidePower', function() {
  it('Should play', function() {
    const card = new PeroxidePower();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(2);
  });
});
