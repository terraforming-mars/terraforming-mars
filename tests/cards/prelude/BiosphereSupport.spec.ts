import {expect} from 'chai';
import {BiosphereSupport} from '../../../src/server/cards/prelude/BiosphereSupport';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {testGame} from '../../TestGame';

describe('BiosphereSupport', function() {
  let card: BiosphereSupport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BiosphereSupport();
    [/* skipped */, player] = testGame(1);
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
