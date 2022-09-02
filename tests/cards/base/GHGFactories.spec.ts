import {expect} from 'chai';
import {GHGFactories} from '../../../src/server/cards/base/GHGFactories';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('GHGFactories', function() {
  let card: GHGFactories;
  let player: Player;

  beforeEach(function() {
    card = new GHGFactories();
    player = TestPlayer.BLUE.newPlayer();
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
