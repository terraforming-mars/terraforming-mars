import {expect} from 'chai';
import {LagrangeObservatory} from '../../../src/cards/base/LagrangeObservatory';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('LagrangeObservatory', function() {
  it('Should play', function() {
    const card = new LagrangeObservatory();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
