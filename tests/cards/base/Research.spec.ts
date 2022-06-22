import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Research', function() {
  it('Should play', function() {
    const card = new Research();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
