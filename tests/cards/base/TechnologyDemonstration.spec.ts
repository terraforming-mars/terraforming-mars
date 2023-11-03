import {expect} from 'chai';
import {TechnologyDemonstration} from '../../../src/server/cards/base/TechnologyDemonstration';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TechnologyDemonstration', function() {
  it('Should play', function() {
    const card = new TechnologyDemonstration();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
