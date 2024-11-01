import {expect} from 'chai';
import {Researcher} from '../../../src/server/milestones/newMilestones/Researcher';
import {TestPlayer} from '../../TestPlayer';

describe('Researcher', () => {
  it('Standard test', () => {
    const milestone = new Researcher();
    const player = TestPlayer.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {science: 3};

    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {science: 4};

    expect(milestone.canClaim(player)).is.true;

    // Wild tag counts.

    player.tagsForTest = {science: 3, wild: 1};

    expect(milestone.canClaim(player)).is.true;
  });
});
