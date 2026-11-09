import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Coastguard, Irrigator} from '../../src/server/milestones/Irrigator';
import {addCity, addGreenery, maxOutOceans} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {BoardName} from '@/common/boards/BoardName';
import {Board} from '@/server/boards/Board';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Irrigator', () => {
  let milestone: Irrigator;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Irrigator();
    [/* game */, player] = testGame(2);

    maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    addCity(player, '09');
    addGreenery(player, '20');
    addCity(player, '11');
    expect(milestone.canClaim(player)).is.false;

    addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {modularMA: false, tiles: 2, expected: false},
    {modularMA: false, tiles: 3, expected: true},
    {modularMA: true, tiles: 3, expected: false},
    {modularMA: true, tiles: 4, expected: true},
  ] as const) {
    it('Coastguard: MarsBot needs 3 tiles next to oceans on Terra Cimmeria and 4 with the expansion: ' + JSON.stringify(run), () => {
      const [game, player] = testGame(1, {boardName: BoardName.TERRA_CIMMERIA_NOVA, modularMA: run.modularMA});
      const marsBot = fakeMarsBot({game, player});
      maxOutOceans(player);
      const coastalSpaces = game.board.getAvailableSpacesOnLand(player)
        .filter((space) => game.board.getAdjacentSpaces(space).some(Board.isOceanSpace));
      for (const space of coastalSpaces.slice(0, run.tiles)) {
        addGreenery(player, space.id);
      }

      expect(new Coastguard().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
