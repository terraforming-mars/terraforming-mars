import {expect} from 'chai';
import {InventionContest} from '../../../src/cards/base/InventionContest';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('InventionContest', function() {
  it('Should play', function() {
    const card = new InventionContest();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player)!;
    expect(action).is.not.undefined;
    action.cb([action.cards[0]]);
    expect(game.dealer.discarded).has.lengthOf(2);
    expect(game.dealer.discarded.indexOf(action.cards[0])).to.eq(-1);
    expect(game.dealer.discarded.indexOf(action.cards[1])).not.to.eq(-1);
    expect(game.dealer.discarded.indexOf(action.cards[2])).not.to.eq(-1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).to.eq(action.cards[0]);
  });
});
