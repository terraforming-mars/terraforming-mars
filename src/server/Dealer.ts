import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {SerializedDealer} from './SerializedDealer';
import {CardFinder} from './CardFinder';

export class Dealer {
  public deck: Array<IProjectCard> = [];
  public preludeDeck: Array<IProjectCard> = [];
  public discarded: Array<IProjectCard> = [];
  public corporationCards: Array<ICorporationCard> = [];

  private constructor() {}

  public static deserialize(d: SerializedDealer): Dealer {
    // TODO(kberg): serializing the randomizer would help when using a seeded game that reshuffles.
    const dealer = new Dealer();
    const cardFinder = new CardFinder();

    dealer.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
    dealer.deck = cardFinder.cardsFromJSON(d.deck);
    dealer.discarded = cardFinder.cardsFromJSON(d.discarded);
    dealer.preludeDeck = cardFinder.cardsFromJSON(d.preludeDeck);
    return dealer;
  }
}
