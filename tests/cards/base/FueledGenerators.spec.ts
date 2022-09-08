import {expect} from 'chai';
import {FueledGenerators} from '../../../src/server/cards/base/FueledGenerators';
import {Resources} from '../../../src/common/Resources';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    player.production.add(Resources.PLANTS, 1);
    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(1);
  });
});
