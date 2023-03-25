import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {InventionContest} from '../../../src/server/cards/base/InventionContest';
import {testGame} from '../../TestGame';

describe('InventionContest', function() {
  it('Should play', function() {
    const card = new InventionContest();
    const [game, player] = testGame(2);

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard<IProjectCard>);
    action.cb([action.cards[0]]);

    expect(game.projectDeck.discardPile).has.lengthOf(2);
    expect(game.projectDeck.discardPile.indexOf(action.cards[0])).to.eq(-1);
    expect(game.projectDeck.discardPile.indexOf(action.cards[1])).not.to.eq(-1);
    expect(game.projectDeck.discardPile.indexOf(action.cards[2])).not.to.eq(-1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).to.eq(action.cards[0]);
  });
});
