import {expect} from 'chai';
import {IoResearchOutpost} from '../../../src/server/cards/prelude/IoResearchOutpost';
import {testGame} from '../../TestGame';

describe('IoResearchOutpost', () => {
  it('Should play', () => {
    const card = new IoResearchOutpost();
    const [/* game */, player] = testGame(1);
    testGame(1);
    card.play(player);

    expect(player.production.titanium).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
