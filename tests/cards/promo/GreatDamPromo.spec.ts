import {expect} from 'chai';
import {GreatDamPromo} from '../../../src/cards/promo/GreatDamPromo';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('GreatDamPromo', function() {
  let card: GreatDamPromo;
  let player: Player;

  beforeEach(function() {
    card = new GreatDamPromo();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without meeting requirements', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 4);

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Works with Ares', function() {
    maxOutOceans(player, 4).forEach((space) => space.tile = {tileType: TileType.OCEAN_CITY});

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
