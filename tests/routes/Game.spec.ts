import {expect} from 'chai';
import {GameHandler} from '../../src/routes/Game';
import {BoardName} from '../../src/common/boards/BoardName';
import {RandomBoardOption} from '../../src/common/boards/RandomBoardOption';

describe('GameHandler', () => {
  it('Official random boards do not include fan maps', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.OFFICIAL)).deep.eq([BoardName.ORIGINAL, BoardName.HELLAS, BoardName.ELYSIUM]);
  });
  it('Official random boards do include fan maps', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.ALL)).deep.eq([BoardName.ORIGINAL, BoardName.HELLAS, BoardName.ELYSIUM, BoardName.ARABIA_TERRA, BoardName.VASTITAS_BOREALIS]);
  });
});
