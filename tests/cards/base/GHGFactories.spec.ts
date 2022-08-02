import {expect} from 'chai';
import {GHGFactories} from '../../../src/cards/base/GHGFactories';
import {Player} from '../../../src/Player';
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
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(4);
  });
});
