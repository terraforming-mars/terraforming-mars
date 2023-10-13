import {expect} from 'chai';
import {BribedCommittee} from '../../../src/server/cards/base/BribedCommittee';
import {testGame} from '../../TestGame';

describe('BribedCommittee', function() {
  it('Should play', function() {
    const card = new BribedCommittee();
    const [/* skipped */, player] = testGame(2);
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(-2);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
