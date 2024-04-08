import {expect} from 'chai';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('GanymedeColony', function() {
  it('Should play', function() {
    const card = new GanymedeColony();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
