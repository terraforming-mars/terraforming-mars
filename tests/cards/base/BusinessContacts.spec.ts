import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {BusinessContacts} from '../../../src/server/cards/base/BusinessContacts';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('BusinessContacts', function() {
  it('Should play', function() {
    const card = new BusinessContacts();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard<IProjectCard>);
    const [card1, card2, card3, card4] = action.cards;

    action.cb([card1, card2]);

    expect(player.cardsInHand).deep.eq([card1, card2]);
    expect(game.projectDeck.discardPile).deep.eq([card3, card4]);
  });
});
