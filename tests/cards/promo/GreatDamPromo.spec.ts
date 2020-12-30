import {expect} from 'chai';
import {GreatDamPromo} from '../../../src/cards/promo/GreatDamPromo';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayers} from '../../TestingUtils';

describe('GreatDamPromo', function() {
  let card : GreatDamPromo; let player : Player; let game : Game;

  beforeEach(function() {
    card = new GreatDamPromo();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
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
