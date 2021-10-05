import {expect} from 'chai';
import {GameHandler} from '../../src/routes/Game';
import {BoardName, RandomBoardOption} from '../../src/boards/BoardName';

describe('GameHandler', () => {
  it('Official random boards do not include arabia terra', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.OFFICIAL)).deep.eq([BoardName.ORIGINAL, BoardName.HELLAS, BoardName.ELYSIUM]);
  });
  it('Official random boards do not include arabia terra', () => {
    expect(GameHandler.boardOptions(RandomBoardOption.ALL)).deep.eq([BoardName.ORIGINAL, BoardName.HELLAS, BoardName.ELYSIUM, BoardName.ARABIA_TERRA]);
  });
});
