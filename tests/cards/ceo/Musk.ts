import {expect} from 'chai';
import {Musk} from '../../../src/server/cards/ceos/Musk';
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Musk', function() {
  let card: Musk;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Musk();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.playedCards.push(card);
  });

  it('Takes action with no Earth cards', function() {
    expect(player.titanium).to.eq(0);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(player.titanium).to.eq(6);
  });

  it('Can only act once per game', function() {
    expect(player.titanium).to.eq(0);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });


  it('Takes action with one Earth card, discards it', function() {
    const earthCard = fakeCard({tags: [Tag.EARTH]});
    expect(player.cardsInHand).has.length(0);
    player.cardsInHand.push(earthCard);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard]);
    runAllActions(player.game);
    expect(player.cardsInHand).has.length(1);
    expect(player.titanium).to.eq(7);
  });

  it('Takes action with three Earth cards, discards all', function() {
    const earthCard1 = fakeCard({tags: [Tag.EARTH]});
    const earthCard2 = fakeCard({tags: [Tag.EARTH]});
    const earthCard3 = fakeCard({tags: [Tag.EARTH]});
    player.cardsInHand.push(earthCard1, earthCard2, earthCard3);
    expect(player.titanium).to.eq(0);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard1, earthCard2, earthCard3]);
    runAllActions(player.game);
    expect(player.cardsInHand).has.length(3);
    // Make sure all the drawn cards have Space tag
    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
    expect(player.titanium).to.eq(9);
  });

  it('Takes action with two Earth cards, discards two, keeps one', function() {
    const earthCard1 = fakeCard({tags: [Tag.EARTH]});
    const earthCard2 = fakeCard({tags: [Tag.EARTH]});
    const earthCard3 = fakeCard({tags: [Tag.EARTH]});
    player.cardsInHand.push(earthCard1, earthCard2, earthCard3);
    expect(player.titanium).to.eq(0);
    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([earthCard1, earthCard2]);
    runAllActions(player.game);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags.includes(Tag.EARTH)).is.true;
    player.cardsInHand.shift(); // Drop the Earth card
    // Make sure all the remaining/drawn cards have Space tag
    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
    expect(player.titanium).to.eq(8);
  });
});
