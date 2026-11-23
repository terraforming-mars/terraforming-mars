import {SerializedDeck} from '@/server/cards/SerializedDeck';
import {cardsFromJSON, ceosFromJSON, corporationCardsFromJSON, preludesFromJSON} from '@/server/createCard';
import {CardName} from '@/common/cards/CardName';
import {Random} from '@/common/utils/Random';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Logger} from '@/server/logs/Logger';
import {IPreludeCard} from '@/server/cards/prelude/IPreludeCard';
import {ICeoCard} from '@/server/cards/ceos/ICeoCard';
import {Deck} from '@/server/cards/Deck';

export class CorporationDeck extends Deck<ICorporationCard> {
  public constructor(deck: Array<ICorporationCard>, discarded: Array<ICorporationCard>, random: Random) {
    super('corporation', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<ICorporationCard> {
    const deck = corporationCardsFromJSON(d.drawPile);
    const discarded = corporationCardsFromJSON(d.discardPile);
    return new CorporationDeck(deck, discarded, random);
  }
}

export class ProjectDeck extends Deck<IProjectCard> {
  public constructor(deck: Array<IProjectCard>, discarded: Array<IProjectCard>, random: Random) {
    super('project', deck, discarded, random);
  }

  public drawByConditionOrThrow(logger: Logger, total: number, include: (card: IProjectCard) => boolean) {
    const result: Array<IProjectCard> = [];
    const discardedCards = new Array<CardName>();

    while (result.length < total) {
      if (discardedCards.length >= this.drawPile.length + this.discardPile.length) {
        logger.log(`discarded every ${this.type} card without a match`);
        break;
      }
      const projectCard = this.drawOrThrow(logger);
      if (include(projectCard)) {
        result.push(projectCard);
      } else {
        discardedCards.push(projectCard.name);
        this.discard(projectCard);
      }
    }
    if (discardedCards.length > 0) {
      logger.log('Discarded ${0} cards ${1}', (b) => b.number(discardedCards.length).cardNames(discardedCards, {ellipsis: true}));
    }

    return result;
  }

  public static deserialize(d: SerializedDeck, random: Random): ProjectDeck {
    const deck = cardsFromJSON(d.drawPile);
    const discarded = cardsFromJSON(d.discardPile);
    return new ProjectDeck(deck, discarded, random);
  }
}

const INCOMPATIBLE_PRELUDES = [CardName.BY_ELECTION, CardName.THE_NEW_SPACE_RACE] as const;
export class PreludeDeck extends Deck<IPreludeCard> {
  public constructor(deck: Array<IPreludeCard>, discarded: Array<IPreludeCard>, random: Random) {
    const copy = [...deck];
    const indexes = INCOMPATIBLE_PRELUDES.map((name) => deck.findIndex((c) => c.name === name));
    if (indexes[0] >= 0 && indexes[1] >= 0) {
      // Remove one from the game, randomly
      const target = random.nextInt(2);
      const indexToRemove = indexes[target];
      copy.splice(indexToRemove, 1);
    }

    super('prelude', copy, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<IPreludeCard> {
    const deck = preludesFromJSON(d.drawPile);
    const discarded = preludesFromJSON(d.discardPile);
    return new PreludeDeck(deck, discarded, random);
  }
}

export class CeoDeck extends Deck<ICeoCard> {
  public constructor(deck: Array<ICeoCard>, discarded: Array<ICeoCard>, random: Random) {
    super('ceo', deck, discarded, random);
  }

  public static deserialize(d: SerializedDeck, random: Random): Deck<ICeoCard> {
    const deck = ceosFromJSON(d.drawPile);
    const discarded = ceosFromJSON(d.discardPile);
    return new CeoDeck(deck, discarded, random);
  }
}
