import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';

describe('AcquiredCompany', function() {
  it('Should play', function() {
    const card = new AcquiredCompany();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
