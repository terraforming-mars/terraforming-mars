
import {expect} from 'chai';
import {BusinessContacts} from '../../../src/cards/base/BusinessContacts';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';

describe('BusinessContacts', function() {
  it('Should play', function() {
    const card = new BusinessContacts();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
    expect(action instanceof SelectCard).is.true;
    const card1 = action.cards[0];
    const card2 = action.cards[1];
    const card3 = action.cards[2];
    const card4 = action.cards[3];
    action.cb([card1, card2]);
    expect(player.cardsInHand.indexOf(card1)).to.eq(0);
    expect(player.cardsInHand.indexOf(card2)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(game.dealer.discarded).has.lengthOf(2);
    expect(game.dealer.discarded.indexOf(card3)).to.eq(0);
    expect(game.dealer.discarded.indexOf(card4)).to.eq(1);
  });
});
