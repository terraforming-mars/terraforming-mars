import {expect} from 'chai';
import {GreatDamPromo} from '../../../src/server/cards/promo/GreatDamPromo';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('GreatDamPromo', function() {
  let card: GreatDamPromo;
  let player: TestPlayer;

  beforeEach(function() {
    card = new GreatDamPromo();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play without meeting requirements', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 4);

    cast(card.play(player), SelectSpace);
    expect(player.production.energy).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Works with Ares', function() {
    maxOutOceans(player, 4).forEach((space) => space.tile = {tileType: TileType.OCEAN_CITY});

    cast(card.play(player), SelectSpace);
    expect(player.production.energy).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
