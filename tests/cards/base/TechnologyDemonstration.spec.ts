import {expect} from 'chai';
import {TechnologyDemonstration} from '../../../src/server/cards/base/TechnologyDemonstration';
import {testGame} from '../../TestGame';

describe('TechnologyDemonstration', function() {
  it('Should play', function() {
    const card = new TechnologyDemonstration();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
