import {expect} from 'chai';
import {IoSulphurResearch} from '../../../src/cards/venusNext/IoSulphurResearch';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('IoSulphurResearch', function() {
  it('Should play', function() {
    const card = new IoSulphurResearch();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
