import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {BusinessContacts} from '../../../src/server/cards/base/BusinessContacts';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';

describe('BusinessContacts', () => {
  it('Should play', () => {
    const card = new BusinessContacts();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard<IProjectCard>);
    const [card1, card2, card3, card4] = action.cards;

    action.cb([card1, card2]);

    expect(player.cardsInHand).deep.eq([card1, card2]);
    expect(game.projectDeck.discardPile).deep.eq([card3, card4]);
  });

  it('Cannot draw when the deck is empty', () => {
    const card = new BusinessContacts();
    const [game, player] = testGame(2);

    game.projectDeck.discardPile.length = 0;
    game.projectDeck.drawPile.length = 5;
    expect(card.canPlay(player)).is.true;
    game.projectDeck.drawPile.length = 4;
    expect(card.canPlay(player)).is.true;
    game.projectDeck.drawPile.length = 3;
    expect(card.canPlay(player)).is.false;
    game.projectDeck.drawPile.length = 2;
    expect(card.canPlay(player)).is.false;
  });
});
