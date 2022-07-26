import {expect} from 'chai';
import {EquatorialMagnetizer} from '../../../src/cards/base/EquatorialMagnetizer';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('EquatorialMagnetizer', function() {
  let card: EquatorialMagnetizer;
  let player: Player;

  beforeEach(function() {
    card = new EquatorialMagnetizer();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
