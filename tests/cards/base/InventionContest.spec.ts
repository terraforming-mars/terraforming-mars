import {expect} from 'chai';
import {InventionContest} from '../../../src/server/cards/base/InventionContest';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('InventionContest', function() {
  it('Should play', function() {
    const card = new InventionContest();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
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
