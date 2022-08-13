import {expect} from 'chai';
import {CoreMine} from '../../src/server/cards/moon/CoreMine';
import {ResearchNetwork} from '../../src/server/cards/prelude/ResearchNetwork';
import {OneGiantStep} from '../../src/server/moon/OneGiantStep';
import {TestPlayer} from '../TestPlayer';

describe('OneGiantStep', () => {
  it('Standard test', () => {
    const milestone = new OneGiantStep();
    const player = TestPlayer.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;
    player.playedCards = [
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
    ];
    expect(milestone.canClaim(player)).is.not.true;
    player.playedCards = [
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
    ];
    expect(milestone.canClaim(player)).is.true;
  });

  it('Wild tag counts', () => {
    const milestone = new OneGiantStep();
    const player = TestPlayer.BLUE.newPlayer();
    player.playedCards = [
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
      new CoreMine(),
    ];
    expect(milestone.canClaim(player)).is.not.true;
    player.playedCards.push(new ResearchNetwork());
    expect(milestone.canClaim(player)).is.true;
  });
});
