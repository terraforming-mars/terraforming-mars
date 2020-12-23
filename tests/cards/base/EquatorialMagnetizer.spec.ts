import {expect} from 'chai';
import {EquatorialMagnetizer} from '../../../src/cards/base/EquatorialMagnetizer';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EquatorialMagnetizer', function() {
  let card : EquatorialMagnetizer; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EquatorialMagnetizer();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Should act', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canAct(player, game)).is.true;

    card.action(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
