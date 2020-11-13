import {expect} from 'chai';
import {GreatDamPromo} from '../../../src/cards/promo/GreatDamPromo';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {maxOutOceans} from '../../TestingUtils';
import {TileType} from '../../../src/TileType';

describe('GreatDamPromo', function() {
  let card : GreatDamPromo; let player : Player; let game : Game;

  beforeEach(function() {
    card = new GreatDamPromo();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play without meeting requirements', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, game, 4);

    const action = card.play(player, game);
    expect(action instanceof SelectSpace).is.true;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Works with Ares', function() {
    maxOutOceans(player, game, 4).forEach((space) => space.tile = {tileType: TileType.OCEAN_CITY});

    const action = card.play(player, game);
    expect(action instanceof SelectSpace).is.true;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
