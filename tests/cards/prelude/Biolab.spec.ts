import {expect} from 'chai';
import {Biolab} from '../../../src/server/cards/prelude/Biolab';
import {testGame} from '../../TestGame';

describe('Biolab', () => {
  it('Should play', () => {
    const card = new Biolab();
    const [/* game */, player] = testGame(1);
    testGame(1);
    card.play(player);

    expect(player.production.plants).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
