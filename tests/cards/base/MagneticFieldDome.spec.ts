import {expect} from 'chai';
import {MagneticFieldDome} from '../../../src/server/cards/base/MagneticFieldDome';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticFieldDome', function() {
  let card: MagneticFieldDome;
  let player: Player;

  beforeEach(function() {
    card = new MagneticFieldDome();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 2);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
