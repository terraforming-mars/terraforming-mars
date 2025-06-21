import {expect} from 'chai';
import {Entrepreneur} from '../../src/server/awards/Entrepreneur';
import {TileType} from '../../src/common/TileType';
import {testGame} from '../TestGame';
import {IPlayer} from '../../src/server/IPlayer';
import {SpaceId} from '../../src/common/Types';
import {AdjacencyBonus} from '../../src/server/ares/AdjacencyBonus';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {addGreenery} from '../TestingUtils';

function addAdjacencyBonus(player: IPlayer, spaceId: SpaceId, adjacency: AdjacencyBonus = {bonus: [SpaceBonus.HEAT]}): void {
  const space = player.game.board.getSpaceOrThrow(spaceId);
  space.tile = {tileType: TileType.GREENERY};
  space.player = player;
  space.adjacency = adjacency;
}

describe('Entrepreneur', () => {
  it('Correctly counts ocean tiles', () => {
    const award = new Entrepreneur();
    const [/* game */, player/* , player2 */] = testGame(2);

    expect(award.getScore(player)).to.eq(0);

    // This space won't count.
    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(0);

    // This one does
    addAdjacencyBonus(player, '10');
    expect(award.getScore(player)).to.eq(1);

    // This one does
    addAdjacencyBonus(player, '11');
    expect(award.getScore(player)).to.eq(2);

    // But this one has a cost, and doesn't count.
    addAdjacencyBonus(player, '12', {bonus: [], cost: 2});
    expect(award.getScore(player)).to.eq(2);
  });
});
