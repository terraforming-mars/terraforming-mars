import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PowerPlant', function() {
  it('Should play', function() {
    const card = new PowerPlant();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    expect(card.play(player)).is.undefined;
    expect(player.production.energy).to.eq(1);
  });
});
