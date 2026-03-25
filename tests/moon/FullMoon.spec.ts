import {expect} from 'chai';
import {FullMoon} from '../../src/server/moon/FullMoon';
import {TestPlayer} from '../TestPlayer';

describe('FullMoon', () => {
  it('Standard test', () => {
    const award = new FullMoon();
    const player = TestPlayer.BLUE.newPlayer();
    expect(award.getScore(player)).eq(0);
    player.tagsForTest = {moon: 1};
    expect(award.getScore(player)).eq(1);
    player.tagsForTest = {moon: 2};
    expect(award.getScore(player)).eq(2);
  });

  it('Wild tag does not count', () => {
    const award = new FullMoon();
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {moon: 5};
    expect(award.getScore(player)).eq(5);
    player.tagsForTest = {moon: 5, wild: 1};
    expect(award.getScore(player)).eq(5);
  });
});
