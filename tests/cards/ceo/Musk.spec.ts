import {expect} from 'chai';
import {Musk} from '../../../src/server/cards/ceos/Musk';
import {Tag} from '../../../src/common/cards/Tag';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';


describe('Musk', () => {
  let card: Musk;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Musk();
    [/* game */, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('Can act without cards', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action with no Earth cards', () => {
    expect(player.titanium).to.eq(0);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(player.titanium).to.eq(6);
  });

  it('Can only act once per game', () => {
    expect(player.titanium).to.eq(0);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action with one Earth card, discards it', () => {
    const earthCard = new EarthOffice();
    player.cardsInHand.push(earthCard);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard]);
    runAllActions(player.game);
    expect(player.titanium).to.eq(7);
    expect(player.cardsInHand).has.length(1);
  });

  it('Takes action with three Earth cards, discards all', () => {
    const earthCard1 = fakeCard({tags: [Tag.EARTH]});
    const earthCard2 = fakeCard({tags: [Tag.EARTH]});
    const earthCard3 = fakeCard({tags: [Tag.EARTH]});
    player.cardsInHand.push(earthCard1, earthCard2, earthCard3);
    expect(player.titanium).to.eq(0);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard1, earthCard2, earthCard3]);
    runAllActions(player.game);
    expect(player.titanium).to.eq(9);
    expect(player.cardsInHand).has.length(3);
    // Make sure all the drawn cards have Space tag
    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
  });

  it('Takes action with two Earth cards, discards two, keeps one', () => {
    const earthCard1 = fakeCard({tags: [Tag.EARTH]});
    const earthCard2 = fakeCard({tags: [Tag.EARTH]});
    const earthCard3 = fakeCard({tags: [Tag.EARTH]});
    player.cardsInHand.push(earthCard1, earthCard2, earthCard3);
    expect(player.titanium).to.eq(0);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard1, earthCard2]);
    runAllActions(player.game);
    expect(player.titanium).to.eq(8);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags.includes(Tag.EARTH)).is.true;
    player.cardsInHand.shift(); // Drop the Earth card
    // Make sure all the remaining/drawn cards have Space tag
    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
  });
});
