import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest} from './cards/CardManifest';
import {CardName} from './CardName';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './cards/promo/PromoCardManifest';
import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './cards/venusNext/VenusCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './cards/community/CommunityCardManifest';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';
import {StandardProjectCard} from './cards/standardProjects/StandardProjectCard';
import {MOON_CARD_MANIFEST} from './cards/moon/MoonCardManifest';

export class CardFinder {
    private static decks: undefined | Array<CardManifest>;
    private static getDecks(): Array<CardManifest> {
      if (CardFinder.decks === undefined) {
        CardFinder.decks = [
          BASE_CARD_MANIFEST,
          CORP_ERA_CARD_MANIFEST,
          PROMO_CARD_MANIFEST,
          VENUS_CARD_MANIFEST,
          COLONIES_CARD_MANIFEST,
          PRELUDE_CARD_MANIFEST,
          TURMOIL_CARD_MANIFEST,
          ARES_CARD_MANIFEST,
          COMMUNITY_CARD_MANIFEST,
          MOON_CARD_MANIFEST,
        ];
      }
      return CardFinder.decks;
    }

    public getStandardProjectCardByName(cardName: string): StandardProjectCard | undefined {
      let found : (ICardFactory<StandardProjectCard> | undefined);
      CardFinder.getDecks().some((deck) => {
        found = deck.standardProjects.findByCardName(cardName as CardName);
        return found !== undefined;
      });
      if (found !== undefined) {
        return new found.Factory();
      }
      console.warn(`standard project card not found ${cardName}`);
      return undefined;
    }

    public getCorporationCardByName(cardName: string): CorporationCard | undefined {
      let found : (ICardFactory<CorporationCard> | undefined);
      CardFinder.getDecks().some((deck) => {
        found = deck.corporationCards.findByCardName(cardName as CardName);
        return found !== undefined;
      });
      if (found !== undefined) {
        return new found.Factory();
      }
      console.warn(`corporation card not found ${cardName}`);
      return undefined;
    }

    // Function to return a card object by its name
    // NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
    // TODO(kberg): Find the use cases where this is used to find Prelude cards and filter them out to
    //              another function, perhaps?
    public getProjectCardByName(cardName: string): IProjectCard | undefined {
      let found : (ICardFactory<IProjectCard> | undefined);
      CardFinder.getDecks().some((deck) => {
        found = deck.projectCards.findByCardName(cardName as CardName);
        if (found === undefined) {
          found = deck.preludeCards.findByCardName(cardName as CardName);
        }
        return found !== undefined;
      });
      if (found !== undefined) {
        return new found.Factory();
      }
      console.warn(`card not found ${cardName}`);
      return undefined;
    }

    public cardsFromJSON(cards: Array<ICard | CardName>): Array<IProjectCard> {
      if (cards === undefined) {
        console.warn('missing cards calling cardsFromJSON');
        return [];
      }
      const result: Array<IProjectCard> = [];
      cards.forEach((element: ICard | CardName) => {
        if (typeof element !== 'string') {
          element = element.name;
        }
        const card = this.getProjectCardByName(element);
        if (card !== undefined) {
          result.push(card);
        } else {
          console.warn(`card ${element} not found while loading game.`);
        }
      });
      return result;
    }

    public corporationCardsFromJSON(cards: Array<ICard | CardName>): Array<CorporationCard> {
      if (cards === undefined) {
        console.warn('missing cards calling corporationCardsFromJSON');
        return [];
      }
      const result: Array<CorporationCard> = [];
      cards.forEach((element: ICard | CardName) => {
        if (typeof element !== 'string') {
          element = element.name;
        }
        const card = this.getCorporationCardByName(element);
        if (card !== undefined) {
          result.push(card);
        } else {
          console.warn(`corporation ${element} not found while loading game.`);
        }
      });
      return result;
    }
}
