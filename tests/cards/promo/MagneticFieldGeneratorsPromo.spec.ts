import {expect} from 'chai';
import {MagneticFieldGeneratorsPromo} from '../../../src/cards/promo/MagneticFieldGeneratorsPromo';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MagneticFieldGeneratorsPromo', function() {
  let card : MagneticFieldGeneratorsPromo; let player : Player;

  beforeEach(function() {
    card = new MagneticFieldGeneratorsPromo();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
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
