import {expect} from 'chai';
import {MagneticFieldGeneratorsPromo} from '../../../src/server/cards/promo/MagneticFieldGeneratorsPromo';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticFieldGeneratorsPromo', function() {
  let card: MagneticFieldGeneratorsPromo;
  let player: Player;

  beforeEach(function() {
    card = new MagneticFieldGeneratorsPromo();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play without enough energy production', function() {
    player.addProduction(Resources.ENERGY, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
