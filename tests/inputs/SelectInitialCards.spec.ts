import {expect} from 'chai';
import {testGame} from '../TestGame';
import {SelectInitialCards} from '../../src/server/inputs/SelectInitialCards';
import {TestPlayer} from '../TestPlayer';
import {CardName} from '../../src/common/cards/CardName';
import {ICorporationCard} from '../../src/server/cards/corporation/ICorporationCard';
import {cardsFromJSON, ceosFromJSON, corporationCardsFromJSON, preludesFromJSON} from '../../src/server/createCard';
import {toName} from '../../src/common/utils/utils';

describe('SelectInitialCards', () => {
  let player: TestPlayer;
  let corp: ICorporationCard | undefined = undefined;
  let selectInitialCards: SelectInitialCards;

  function cb(corporation: ICorporationCard) {
    corp = corporation;
    return undefined;
  }

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    player.dealtCorporationCards = corporationCardsFromJSON([CardName.INVENTRIX, CardName.HELION]);
    player.dealtProjectCards = cardsFromJSON([CardName.ANTS, CardName.BACTOVIRAL_RESEARCH, CardName.COMET_AIMING, CardName.DIRIGIBLES]);
    selectInitialCards = new SelectInitialCards(player, cb);
  });

  it('fail, no corporations', () => {
    expect(() =>
      selectInitialCards.process({type: 'initialCards', responses: [
        {type: 'card', cards: []},
        {type: 'card', cards: []},
      ]}, player))
      .to.throw(/Not enough cards selected/);
  });

  it('fail, invalid corporation', () => {
    expect(() =>
      selectInitialCards.process({type: 'initialCards', responses: [
        {type: 'card', cards: [CardName.THARSIS_REPUBLIC]},
        {type: 'card', cards: []},
      ]}, player))
      .to.throw(/Card Tharsis Republic not found/);
  });

  it('fail, too many corporations', () => {
    expect(() =>
      selectInitialCards.process({type: 'initialCards', responses: [
        {type: 'card', cards: [CardName.INVENTRIX, CardName.HELION]},
        {type: 'card', cards: []},
      ]}, player))
      .to.throw(/Too many cards selected/);
  });

  it('Simple', () => {
    player.game.projectDeck.discardPile.length = 0; // Emptying the discard pile, which has 4 cards setting up the solo opponent.
    // player.game.corporationDeck.discardPile.length = 0;

    selectInitialCards.process({type: 'initialCards', responses: [
      {type: 'card', cards: [CardName.INVENTRIX]},
      {type: 'card', cards: [CardName.ANTS]},
    ]}, player);

    expect(player.corporations).has.length(0); // This input object doesn't set the player's corporation card
    expect(corp!.name).eq(CardName.INVENTRIX);
    expect(player.cardsInHand.map(toName)).to.have.members([CardName.ANTS]); // But it does set their cards in hand.

    expect(player.game.projectDeck.discardPile.map(toName)).to.have.members([CardName.BACTOVIRAL_RESEARCH, CardName.COMET_AIMING, CardName.DIRIGIBLES]);
    expect(player.game.corporationDeck.discardPile.map(toName)).to.have.members([CardName.HELION]);
  });

  it('Full', () => {
    const [/* game */, player] = testGame(1, {ceoExtension: true, preludeExtension: true});
    player.game.projectDeck.discardPile.length = 0; // Emptying the discard pile, which has 4 cards setting up the solo opponent.
    player.game.corporationDeck.discardPile.length = 0;
    player.dealtCorporationCards = corporationCardsFromJSON([CardName.INVENTRIX, CardName.HELION]);
    player.dealtProjectCards = cardsFromJSON([CardName.ANTS, CardName.BACTOVIRAL_RESEARCH, CardName.COMET_AIMING, CardName.DIRIGIBLES]);
    player.dealtPreludeCards = preludesFromJSON([CardName.LOAN, CardName.BIOLAB, CardName.DONATION, CardName.SUPPLIER]);
    player.dealtCeoCards = ceosFromJSON([CardName.ASIMOV, CardName.MUSK]);
    selectInitialCards = new SelectInitialCards(player, cb);

    selectInitialCards.process({type: 'initialCards', responses: [
      {type: 'card', cards: [CardName.INVENTRIX]},
      {type: 'card', cards: [CardName.LOAN, CardName.BIOLAB]},
      {type: 'card', cards: [CardName.ASIMOV]},
      {type: 'card', cards: [CardName.ANTS]},
    ]}, player);

    expect(player.corporations).has.length(0); // This input object doesn't set the player's corporation card
    expect(corp!.name).eq(CardName.INVENTRIX);
    expect(player.cardsInHand.map(toName)).to.have.members([CardName.ANTS]); // But it does set their cards in hand.
    expect(player.ceoCardsInHand.map(toName)).to.have.members([CardName.ASIMOV]);
    expect(player.preludeCardsInHand.map(toName)).to.have.members([CardName.LOAN, CardName.BIOLAB]);

    expect(player.game.projectDeck.discardPile.map(toName)).to.have.members([CardName.BACTOVIRAL_RESEARCH, CardName.COMET_AIMING, CardName.DIRIGIBLES]);
    expect(player.game.corporationDeck.discardPile.map(toName)).to.have.members([CardName.HELION]);
    expect(player.game.ceoDeck.discardPile.map(toName)).to.have.members([CardName.MUSK]);
    expect(player.game.preludeDeck.discardPile.map(toName)).to.have.members([CardName.DONATION, CardName.SUPPLIER]);
  });
});
