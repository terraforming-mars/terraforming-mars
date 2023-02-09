import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Biofuels} from '../../../src/server/cards/prelude/Biofuels';

describe('Biofuels', function() {
  it('Should play', function() {
    const card = new Biofuels();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(2);
  });
});
