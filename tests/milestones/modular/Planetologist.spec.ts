import {expect} from 'chai';
import {Planetologist} from '../../../src/server/milestones/modular/Planetologist';
import {TestPlayer} from '../../TestPlayer';

describe('Planetologist', () => {
  it('Standard test, cannot play', () => {
    const milestone = new Planetologist();
    const player = TestPlayer.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {earth: 1, jovian: 2, venus: 2};
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = {jovian: 2, venus: 2};
    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Standard test, can play', () => {
    const milestone = new Planetologist();
    const player = TestPlayer.BLUE.newPlayer();

    player.tagsForTest = {earth: 2, jovian: 2, venus: 2};
    expect(milestone.canClaim(player)).is.true;

    player.tagsForTest = {earth: 7, jovian: 3, venus: 7};
    expect(milestone.canClaim(player)).is.true;
  });

  it('wild tag test - can be used but only once', () => {
    const milestone = new Planetologist();
    const player = TestPlayer.BLUE.newPlayer();

    player.tagsForTest = {earth: 1, jovian: 2, venus: 2, wild: 1};
    expect(milestone.canClaim(player)).is.true;
  });

  it('wild tag test - cannot be used more than once', () => {
    const milestone = new Planetologist();
    const player = TestPlayer.BLUE.newPlayer();

    // Player needs one more of each tag, but only has 1 wild tag
    player.tagsForTest = {earth: 1, jovian: 1, venus: 1, wild: 1};
    expect(milestone.canClaim(player)).is.not.true;
  });
});
