
import {expect} from 'chai';
import {Diversifier} from '../../src/milestones/Diversifier';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {ResearchNetwork} from '../../src/cards/prelude/ResearchNetwork';

describe('Diversifier', function() {
  it('Counts wildcard tags as unique tags', function() {
    const milestone = new Diversifier();
    const player = new Player('test', Color.BLUE, false);
    expect(milestone.canClaim(player)).is.not.true;
    for (let i = 0; i < 8; i++) {
      player.playedCards.push(new ResearchNetwork());
    }
    expect(milestone.canClaim(player)).is.true;
  });
});
