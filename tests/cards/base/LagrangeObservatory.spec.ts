import {expect} from 'chai';
import {LagrangeObservatory} from '../../../src/server/cards/base/LagrangeObservatory';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('LagrangeObservatory', function() {
  it('Should play', function() {
    const card = new LagrangeObservatory();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
