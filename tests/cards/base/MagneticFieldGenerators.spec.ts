import {expect} from 'chai';
import {MagneticFieldGenerators} from '../../../src/server/cards/base/MagneticFieldGenerators';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticFieldGenerators', function() {
  let card: MagneticFieldGenerators;
  let player: Player;

  beforeEach(function() {
    card = new MagneticFieldGenerators();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
