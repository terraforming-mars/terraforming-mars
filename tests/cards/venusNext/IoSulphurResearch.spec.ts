import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/cards/venusNext/IoSulphurResearch';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('IoSulphurResearch', function() {
  it('Should play', function() {
    const card = new IoSulphurResearch();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
