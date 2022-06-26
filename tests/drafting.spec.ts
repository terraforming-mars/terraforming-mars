import {IProjectCard} from '../src/cards/IProjectCard';
import {SelectCard} from '../src/inputs/SelectCard';
import {Player} from '../src/Player';
import {expect} from 'chai';
import {finishGeneration} from './TestingUtils';
import {getTestPlayer, newTestGame} from './TestGame';
import {CardName} from '../src/common/cards/CardName';
import {CardFinder} from '../src/CardFinder';
import {ICard} from '../src/cards/ICard';
import {TestPlayer} from './TestPlayer';

// Tests for drafting
describe('drafting', () => {
  it('play - 2 player - draft', function() {
    const game = newTestGame(2, {draftVariant: true});
    const player = getTestPlayer(game, 0);
    const otherPlayer = getTestPlayer(game, 1);
    const deck = game.dealer.deck;

    unshiftCards(deck, [
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BIOFERTILIZER_FACILITY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS]);

    selectCard(player, CardName.BIOFERTILIZER_FACILITY);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.GENE_REPAIR);

    expect(cardNames(player.draftedCards)).deep.eq([CardName.BIOFERTILIZER_FACILITY]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([CardName.GENE_REPAIR]);

    // Second card

    expect(draftSelection(player)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.HACKERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);


    selectCard(player, CardName.FISH);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.ACQUIRED_COMPANY);

    expect(cardNames(player.draftedCards)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.FISH,
    ]);
    expect(cardNames(otherPlayer.draftedCards)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
    ]);

    // Third round

    expect(draftSelection(player)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.HACKERS]);

    selectCard(player, CardName.DECOMPOSERS);
    expect(player.getWaitingFor()).is.undefined;
    selectCard(otherPlayer, CardName.EARTH_OFFICE);

    // No longer drafted cards, they're just cards to buy.
    expect(player.draftedCards).is.empty;
    expect(otherPlayer.draftedCards).is.empty;

    expect(draftSelection(player)).deep.eq([
      CardName.BIOFERTILIZER_FACILITY,
      CardName.FISH,
      CardName.DECOMPOSERS,
      CardName.HACKERS,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
      CardName.EARTH_OFFICE,
      CardName.CAPITAL,
    ]);

    // A nice next step would be to show that those cards above are for purchase, and acquiring them puts them in cardsInHand
    // and that the rest of them are discarded.
  });
});

function getWaitingFor(player: Player): SelectCard<IProjectCard> {
  const action = player.getWaitingFor();
  expect(action).instanceof(SelectCard);
  return action as SelectCard<IProjectCard>;
}

function unshiftCards(deck: Array<IProjectCard>, cards: Array<CardName>) {
  const cardFinder = new CardFinder();
  deck.unshift(...cardFinder.cardsFromJSON(cards));
}

function cardNames(cards: Array<ICard>): Array<CardName> {
  return cards.map((card) => card.name);
}

function draftSelection(player: Player) {
  return getWaitingFor(player).cards.map((card) => card.name);
}

function selectCard<T extends ICard>(player: TestPlayer, cardName: CardName) {
  const selectCard = player.popWaitingFor() as SelectCard<T>;
  const cards = selectCard.cards;
  const card = cards.find((c) => c.name === cardName);
  if (card === undefined) throw new Error(`${cardName} isn't in list`);
  selectCard.cb([card]);
}
