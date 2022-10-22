import {Capitalist} from '../../src/server/milestones/Capitalist';
import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';

describe('Capitalist', () => {
  let milestone: Capitalist;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Capitalist();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 64 M€', () => {
    player.megaCredits = 63;
    expect(milestone.canClaim(player)).is.false;
    player.megaCredits = 64;
    expect(milestone.canClaim(player)).is.true;
  });
});
