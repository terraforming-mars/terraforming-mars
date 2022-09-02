import {expect} from 'chai';
import {MagneticFieldGeneratorsPromo} from '../../../src/server/cards/promo/MagneticFieldGeneratorsPromo';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

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
    player.production.add(Resources.ENERGY, 3);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 4);
    expect(player.simpleCanPlay(card)).is.true;

    cast(card.play(player), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
