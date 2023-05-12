import {expect} from 'chai';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {testGame} from '../../TestGame';

describe('GanymedeColony', function() {
  it('Should play', function() {
    const card = new GanymedeColony();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
