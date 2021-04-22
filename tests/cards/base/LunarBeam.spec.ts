import {expect} from 'chai';
import {LunarBeam} from '../../../src/cards/base/LunarBeam';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunarBeam', function() {
  let card : LunarBeam; let player : Player;

  beforeEach(function() {
    card = new LunarBeam();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can play', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;

    player.addProduction(Resources.MEGACREDITS, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
