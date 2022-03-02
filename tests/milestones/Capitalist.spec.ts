import {Capitalist} from "@/milestones/Capitalist";
import {Player} from "@/Player";
import {expect} from "chai";
import {TestPlayers} from "tests/TestPlayers";

describe('Capitalist', () => {
  let milestone : Capitalist; let player : Player;

  beforeEach(() => {
    milestone = new Capitalist();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can claim with 64 M€', () => {
    player.megaCredits = 64;
    expect(milestone.canClaim(player)).is.true;
  });
});