import {expect} from 'chai';
import {BiosphereSupport} from '../../../src/server/cards/prelude/BiosphereSupport';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('BiosphereSupport', function() {
  let card: BiosphereSupport;
  let player: Player;

  beforeEach(function() {
    card = new BiosphereSupport();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    player.production.add(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(2);
    expect(player.production.megacredits).to.eq(-1);
  });
});
