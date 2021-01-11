import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/cards/venusNext/IoSulphurResearch';
import {TestPlayers} from '../../TestingUtils';

describe('IoSulphurResearch', function() {
  it('Should play', function() {
    const card = new IoSulphurResearch();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
