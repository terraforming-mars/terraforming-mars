import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/server/cards/venusNext/IoSulphurResearch';
import {testGame} from '../../TestGame';

describe('IoSulphurResearch', function() {
  it('Should play', function() {
    const card = new IoSulphurResearch();
    const [, player] = testGame(2);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
