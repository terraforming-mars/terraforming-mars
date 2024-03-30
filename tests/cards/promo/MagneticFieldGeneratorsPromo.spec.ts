import {expect} from 'chai';
import {MagneticFieldGeneratorsPromo} from '../../../src/server/cards/promo/MagneticFieldGeneratorsPromo';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MagneticFieldGeneratorsPromo', function() {
  let card: MagneticFieldGeneratorsPromo;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MagneticFieldGeneratorsPromo();
    [game, player] = testGame(2);
  });

  it('Cannot play without enough energy production', function() {
    player.production.add(Resource.ENERGY, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
