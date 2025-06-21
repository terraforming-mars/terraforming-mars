import {expect} from 'chai';
import {churn, cast, fakeCard} from '../../TestingUtils';
import {VenusOrbitalSurvey} from '../../../src/server/cards/prelude2/VenusOrbitalSurvey';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Tag} from '../../../src/common/cards/Tag';

describe('VenusOrbitalSurvey', () => {
  let card: VenusOrbitalSurvey;
  const emptyCard = () => fakeCard();
  const wildCard = () => fakeCard({tags: [Tag.WILD]});
  const venusCard = () => fakeCard({tags: [Tag.VENUS]});
  const earthCard = () => fakeCard({tags: [Tag.EARTH]});
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusOrbitalSurvey();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act if bought 0 of 2', () => {
    player.megaCredits = 6;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([]);

    expect(game.projectDeck.discardPile).has.lengthOf(2);
    expect(player.megaCredits).to.eq(6);
  });

  it('Should act if bought 1 of 2', () => {
    player.megaCredits = 3;
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Should act if bought 2 of 2', () => {
    player.megaCredits = 6;
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    selectCard.cb([selectCard.cards[0], selectCard. cards[1]]);
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(2);
    expect(game.projectDeck.discardPile).has.lengthOf(0);
    expect(player.megaCredits).to.eq(0);
  });

  it('Should not offer if none to buy', () => {
    player.megaCredits = 6;
    game.projectDeck.drawPile.push(venusCard(), venusCard());
    cast(churn(card.action(player), player), undefined);

    expect(player.cardsInHand).has.lengthOf(2);
    expect(game.projectDeck.discardPile).has.lengthOf(0);
    expect(player.megaCredits).to.eq(6);
  });

  it('Should act if bought 0 of 1', () => {
    player.megaCredits = 6;
    game.projectDeck.drawPile.push(venusCard(), wildCard());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    selectCard.cb([]);
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(6);
  });

  it('Should act if bought 1 of 1', () => {
    player.megaCredits = 6;
    game.projectDeck.drawPile.push(earthCard(), venusCard());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(2);
    expect(game.projectDeck.discardPile).has.lengthOf(0);
    expect(player.megaCredits).to.eq(3);
  });

  it('Cannot buy from 2 offered if cannot pay', () => {
    player.megaCredits = 2;
    game.projectDeck.drawPile.push(earthCard(), emptyCard());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);

    expect(game.deferredActions).has.lengthOf(0);

    expect(player.cardsInHand).has.lengthOf(0);
    expect(game.projectDeck.discardPile).has.lengthOf(2);
    expect(player.megaCredits).to.eq(2);
  });

  it('Cannot buy from 1 offered if cannot pay', () => {
    player.megaCredits = 2;
    game.projectDeck.drawPile.push(venusCard(), emptyCard());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);

    expect(game.deferredActions).has.lengthOf(0);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(2);
  });

  it('Cannot buy 2 offered if can pay for 1', () => {
    player.megaCredits = 5;
    game.projectDeck.drawPile.push(wildCard(), emptyCard());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    expect(selectCard.config.max).to.eq(1);
    selectCard.cb([selectCard.cards[1]]);

    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(2);
  });
});
