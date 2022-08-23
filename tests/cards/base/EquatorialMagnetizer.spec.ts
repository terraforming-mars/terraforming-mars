import {expect} from 'chai';
import {EquatorialMagnetizer} from '../../../src/server/cards/base/EquatorialMagnetizer';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
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
    player.production.add(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.production.energy).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
