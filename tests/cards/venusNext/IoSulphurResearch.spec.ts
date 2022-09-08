import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/server/cards/venusNext/IoSulphurResearch';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('IoSulphurResearch', function() {
  it('Should play', function() {
    const card = new IoSulphurResearch();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
