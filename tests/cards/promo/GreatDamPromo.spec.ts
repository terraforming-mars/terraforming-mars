import {expect} from 'chai';
import {GreatDamPromo} from '../../../src/server/cards/promo/GreatDamPromo';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast, churn, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('GreatDamPromo', () => {
  let card: GreatDamPromo;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GreatDamPromo();
    [/* game */, player] = testGame(2);
  });

  it('Can not play without meeting requirements', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 4);

    cast(churn(card.play(player), player), SelectSpace);
    expect(player.production.energy).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Works with Ares', () => {
    maxOutOceans(player, 4).forEach((space) => space.tile = {tileType: TileType.OCEAN_CITY});

    cast(churn(card.play(player), player), SelectSpace);
    expect(player.production.energy).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
