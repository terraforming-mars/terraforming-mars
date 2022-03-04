import {Capitalist} from '../../src/milestones/Capitalist';
import {Player} from '../../src/Player';
import {expect} from 'chai';
import {TestPlayers} from '../TestPlayers';

describe('Capitalist', () => {
  let milestone : Capitalist; let player : Player;

  beforeEach(() => {
    milestone = new Capitalist();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can claim with 64 M€', () => {
    player.megaCredits = 63;
    expect(milestone.canClaim(player)).is.false;
    player.megaCredits = 64;
    expect(milestone.canClaim(player)).is.true;
  });
});
