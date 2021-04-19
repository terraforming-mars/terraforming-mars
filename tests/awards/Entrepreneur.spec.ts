import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Entrepreneur} from '../../src/awards/Entrepreneur';
import {TileType} from '../../src/TileType';
import {TestPlayers} from '../TestPlayers';
import {Player} from '../../src/Player';
import {SpaceId} from '../../src/boards/ISpace';
import {IAdjacencyBonus} from '../../src/ares/IAdjacencyBonus';
import {SpaceBonus} from '../../src/SpaceBonus';

function addAdjacencyBonus(player: Player, spaceId: SpaceId, adjacency: IAdjacencyBonus = {bonus: [SpaceBonus.HEAT]}): void {
  const space = player.game.board.getSpace(spaceId);
  space.tile = {tileType: TileType.GREENERY};
  space.player = player;
  space.adjacency = adjacency;
}

describe('Entrepreneur', function() {
  it('Correctly counts ocean tiles', function() {
    const award = new Entrepreneur();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    expect(award.getScore(player)).to.eq(0);

    // This space won't count.
    game.addGreenery(player, '35');
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
