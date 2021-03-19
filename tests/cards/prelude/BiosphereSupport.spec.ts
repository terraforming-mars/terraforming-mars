import {expect} from 'chai';
import {BiosphereSupport} from '../../../src/cards/prelude/BiosphereSupport';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('BiosphereSupport', function() {
  let card : BiosphereSupport; let player : Player;

  beforeEach(function() {
    card = new BiosphereSupport();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
  });
});
