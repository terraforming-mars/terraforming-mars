import {expect} from 'chai';
import {GameSetup, normalizeBoardName} from '../src/server/GameSetup';
import {BoardName} from '../src/common/boards/BoardName';
import {testGame} from './TestGame';
import {toID} from '@/common/utils/utils';

describe('GameSetup', () => {
  // Don't remove this test. It's a placeholder for board renames.
  it('finds renamed boards', () => {
    expect(normalizeBoardName('vastitas borealis novus')).to.equal(BoardName.VASTITAS_BOREALIS_NOVA);
    expect(normalizeBoardName('terra cimmeria novus')).to.equal(BoardName.TERRA_CIMMERIA_NOVA);
  });

  it('restores edges on legacy boards', () => {
    const [game, ...players] = testGame(2, {boardName: BoardName.HELLAS});

    const expected = game.board.spaces.filter((space) => space.edge === true).map(toID);

    const serialized = game.serialize();
    for (const space of serialized.board.spaces) {
      delete space.edge;
    }
    const deserialized = GameSetup.deserializeBoard(players, game.gameOptions, serialized);

    const actual = deserialized.spaces.filter((space) => space.edge === true).map(toID);
    expect(actual).to.have.members(expected);
  });
});
