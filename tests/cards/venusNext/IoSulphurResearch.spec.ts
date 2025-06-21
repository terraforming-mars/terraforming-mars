import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/server/cards/venusNext/IoSulphurResearch';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('IoSulphurResearch', () => {
  it('Should play', () => {
    const card = new IoSulphurResearch();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
