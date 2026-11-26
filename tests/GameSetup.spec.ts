import {expect} from 'chai';
import {normalizeBoardName} from '../src/server/GameSetup';
import {BoardName} from '../src/common/boards/BoardName';

describe('GameSetup', () => {
  // Don't remove this test. It's a placeholder for board renames.
  it('finds renamed boards', () => {
    expect(normalizeBoardName('vastitas borealis novus')).to.equal(BoardName.VASTITAS_BOREALIS_NOVA);
    expect(normalizeBoardName('terra cimmeria novus')).to.equal(BoardName.TERRA_CIMMERIA_NOVA);
  });
});
