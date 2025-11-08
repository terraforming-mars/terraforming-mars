import {expect} from 'chai';
import {cast, churn} from '../../TestingUtils';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Dirigibles', () => {
  let card: Dirigibles;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Dirigibles();
    [/* game */, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act - single target', () => {
    expect(player.getSpendable('floaters')).to.eq(0);
    expect(churn(card.action(player), player)).is.undefined;
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendable('floaters')).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    player.playedCards.push(new FloatingHabs());
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });
});
