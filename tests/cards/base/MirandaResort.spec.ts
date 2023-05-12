import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {MirandaResort} from '../../../src/server/cards/base/MirandaResort';
import {testGame} from '../../TestGame';

describe('MirandaResort', function() {
  it('Should play', function() {
    const card = new MirandaResort();
    const [/* skipped */, player] = testGame(2);

    player.playedCards.push(new BusinessNetwork());
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });
});
