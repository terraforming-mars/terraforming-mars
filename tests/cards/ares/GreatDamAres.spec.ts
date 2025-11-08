import {expect} from 'chai';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {GreatDamAres} from '../../../src/server/cards/ares/GreatDamAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, churn} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GreatDamAres', () => {
  let card: GreatDamAres;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GreatDamAres();
    [/* game */, player] = testGame(2, {aresExtension: true, aresHazards: false});
  });

  it('Requirements + Benefits', () => {
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.not.true;
    maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;
    expect(player.production.energy).to.eq(0);
    card.play(player);
    expect(card.victoryPoints).to.eq(1);
    expect(player.production.energy).to.eq(2);
  });

  it('Requirements', () => {
    maxOutOceans(player, 4);
    const action = cast(churn(card.play(player), player), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile!.tileType).to.eq(TileType.GREAT_DAM);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.ENERGY, SpaceBonus.ENERGY]});
  });
});
