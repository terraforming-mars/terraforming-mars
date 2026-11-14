import {expect} from 'chai';
import {Briber} from '@/server/milestones/Briber';
import {fakeMarsBot} from '../automa/FakeMarsBot';
import {testGame} from '../TestGame';

describe('Briber', () => {
  it('Can claim when able to pay the claim cost plus 12', () => {
    const milestone = new Briber();
    const [, player] = testGame(2);
    player.megaCredits = 19;
    expect(milestone.canClaim(player)).is.false;

    player.megaCredits = 20;
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {megacredits: 19, expected: false},
    {megacredits: 20, expected: true},
  ] as const) {
    it('MarsBot needs 20 M€: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot({megacredits: run.megacredits});

      expect(new Briber().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
