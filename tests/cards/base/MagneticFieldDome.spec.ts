import {expect} from 'chai';
import {MagneticFieldDome} from '../../../src/cards/base/MagneticFieldDome';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MagneticFieldDome', function() {
  let card : MagneticFieldDome; let player : Player;

  beforeEach(function() {
    card = new MagneticFieldDome();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
