import {expect} from 'chai';
import {Builder} from '../../src/server/milestones/Builder';
import {TestPlayer} from '../TestPlayer';

describe('Builder', () => {
  it('Standard test', () => {
    const milestone = new Builder();
    const player = TestPlayer.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {building: 7};

    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {building: 8};

    expect(milestone.canClaim(player)).is.true;

    // Wild tag counts.

    player.tagsForTest = {building: 7, wild: 1};

    expect(milestone.canClaim(player)).is.true;
  });
});
