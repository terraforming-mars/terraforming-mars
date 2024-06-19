import {expect} from 'chai';
import {testGame} from '../TestGame';
import {SelectInitialCards} from '../../src/server/inputs/SelectInitialCards';
import {TestPlayer} from '../TestPlayer';
import {CardName} from '../../src/common/cards/CardName';
import {Inventrix} from '../../src/server/cards/corporation/Inventrix';
import {Helion} from '../../src/server/cards/corporation/Helion';
import {Ants} from '../../src/server/cards/base/Ants';
import {BactoviralResearch} from '../../src/server/cards/promo/BactoviralResearch';
import {CometAiming} from '../../src/server/cards/promo/CometAiming';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {ICorporationCard} from '../../src/server/cards/corporation/ICorporationCard';

// TODO(kberg): Add preludes
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
    player.dealtCorporationCards = [new Inventrix(), new Helion()];
    player.dealtProjectCards = [new Ants(), new BactoviralResearch(), new CometAiming(), new Dirigibles()];
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
    expect(player.game.corporationDeck.discardPile).is.empty;

    selectInitialCards.process({type: 'initialCards', responses: [
      {type: 'card', cards: [CardName.INVENTRIX]},
      {type: 'card', cards: [CardName.ANTS]},
    ]}, player);

    expect(player.corporations).has.length(0); // This input object doesn't set the player's corporation card
    expect(corp!.name).eq(CardName.INVENTRIX);
    expect(player.cardsInHand).has.length(1); // But it does set their cards in hand.
    expect(player.cardsInHand[0].name).eq(CardName.ANTS);

    expect(player.game.projectDeck.discardPile.map((c) => c.name)).has.members([CardName.BACTOVIRAL_RESEARCH, CardName.COMET_AIMING, CardName.DIRIGIBLES]);
    expect(player.game.corporationDeck.discardPile.map((c) => c.name)).has.members([CardName.HELION]);
  });
});
