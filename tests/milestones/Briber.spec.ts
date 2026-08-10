import {expect} from 'chai';
import {Briber} from '../../src/server/milestones/Briber';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';

describe('Briber', () => {
  const milestone = new Briber();

  it('Can claim when able to pay the claim cost plus 12', () => {
    const [, player] = testGame(2);
    player.megaCredits = 19;
    expect(milestone.canClaim(player)).is.false;

    player.megaCredits = 20;
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot qualifies with 20 M€', () => {
    expect(milestone.marsBotCanClaim({mcSupply: 19} as unknown as IMarsBot)).is.false;
    expect(milestone.marsBotCanClaim({mcSupply: 20} as unknown as IMarsBot)).is.true;
  });
});
