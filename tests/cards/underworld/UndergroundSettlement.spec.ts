import {expect} from 'chai';
import {UndergroundSettlement} from '../../../src/server/cards/underworld/UndergroundSettlement';
import {testGame} from '../../TestGame';
import {addCity, cast, churn} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('UndergroundSettlement', () => {
  it('play', () => {
    const card = new UndergroundSettlement();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    const space = selectSpace.spaces[0];
    space.player = undefined;
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.excavator).eq(player);
    expect(player.plants).eq(1);
  });

  // #7073
  it('excavation rules about adjacency should not apply.', () => {
    const card = new UndergroundSettlement();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    const firstSpace = player.game.board.getAvailableSpacesForCity(player)[0];
    addCity(player, firstSpace.id);

    expect(player.canPlay(card)).is.true;
  });
});
