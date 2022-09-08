import {expect} from 'chai';
import {GHGFactories} from '../../../src/server/cards/base/GHGFactories';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('GHGFactories', function() {
  let card: GHGFactories;
  let player: Player;

  beforeEach(function() {
    card = new GHGFactories();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.energy).to.eq(0);
    expect(player.production.heat).to.eq(4);
  });
});
