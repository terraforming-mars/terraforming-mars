import {expect} from 'chai';
import {OneGiantStep} from '../../src/server/moon/OneGiantStep';
import {TestPlayer} from '../TestPlayer';

describe('OneGiantStep', () => {
  it('Standard test', () => {
    const milestone = new OneGiantStep();
    const player = TestPlayer.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;
    player.tagsForTest = {moon: 5};
    expect(milestone.canClaim(player)).is.not.true;
    player.tagsForTest = {moon: 6};
    expect(milestone.canClaim(player)).is.true;
  });

  it('Wild tag counts', () => {
    const milestone = new OneGiantStep();
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {moon: 5};
    expect(milestone.canClaim(player)).is.not.true;
    player.tagsForTest = {moon: 5, wild: 1};
    expect(milestone.canClaim(player)).is.true;
  });
});
