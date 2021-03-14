
import {expect} from 'chai';
import {Diversifier} from '../../src/milestones/Diversifier';
import {ResearchNetwork} from '../../src/cards/prelude/ResearchNetwork';
import {TestPlayers} from '../TestPlayers';

describe('Diversifier', function() {
  it('Counts wildcard tags as unique tags', function() {
    const milestone = new Diversifier();
    const player = TestPlayers.BLUE.newPlayer();
    expect(milestone.canClaim(player)).is.not.true;
    for (let i = 0; i < 8; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });
});
