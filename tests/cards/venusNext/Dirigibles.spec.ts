import {expect} from 'chai';
import {cast, churnAction} from '../../TestingUtils';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Dirigibles', function() {
  let card: Dirigibles;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Dirigibles();
    [/* game */, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act - single target', function() {
    expect(player.getSpendable('floaters')).to.eq(0);
    expect(churnAction(card, player)).is.undefined;
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendable('floaters')).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new FloatingHabs());
    const selectCard = cast(churnAction(card, player), SelectCard);
    selectCard.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });
});
