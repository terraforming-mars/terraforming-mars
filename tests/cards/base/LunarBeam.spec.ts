import {expect} from 'chai';
import {LunarBeam} from '../../../src/server/cards/base/LunarBeam';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('LunarBeam', function() {
  let card: LunarBeam;
  let player: Player;

  beforeEach(function() {
    card = new LunarBeam();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can play', function() {
    player.production.add(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;

    player.production.add(Resources.MEGACREDITS, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
    expect(player.production.heat).to.eq(2);
    expect(player.production.energy).to.eq(2);
  });
});
