import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest} from './cards/CardManifest';
import {CardName} from './common/cards/CardName';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {Deck} from './Deck';
import {PreludeCard} from './cards/prelude/PreludeCard';
import {ALL_CARD_MANIFESTS} from './cards/AllCards';

export class CardFinder {
  private getCardByName<T extends ICard>(cardName: CardName, decks: (manifest: CardManifest) => Array<Deck<T>>): T | undefined {
    let found : (ICardFactory<T> | undefined);
    ALL_CARD_MANIFESTS.some((manifest) => {
      decks(manifest).some((deck) => {
        found = deck.findByCardName(cardName);
        return found;
      });
      return found;
    });
    if (found !== undefined) {
      return new found.Factory();
    }
    console.warn(`card not found ${cardName}`);
    return undefined;
  }

  public getCorporationCardByName(cardName: CardName): CorporationCard | undefined {
    return this.getCardByName(cardName, (manifest) => [manifest.corporationCards]);
  }

  // Function to return a card object by its name
  // NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
  // TODO(kberg): Find the use cases where this is used to find Prelude cards and filter them out to
  //              another function, perhaps?
  public getProjectCardByName(cardName: CardName): IProjectCard | undefined {
    return this.getCardByName(cardName, (manifest) => [manifest.projectCards, manifest.preludeCards]);
  }

  public getPreludeByName(cardName: CardName): PreludeCard | undefined {
    return this.getCardByName(cardName, (manifest) => [manifest.preludeCards]);
  }

  public cardsFromJSON(cards: Array<CardName>): Array<IProjectCard> {
    if (cards === undefined) {
      console.warn('missing cards calling cardsFromJSON');
      return [];
    }
    const result: Array<IProjectCard> = [];
    cards.forEach((element: CardName) => {
      const card = this.getProjectCardByName(element);
      if (card !== undefined) {
        result.push(card);
      } else {
        console.warn(`card ${element} not found while loading game.`);
      }
    });
    return result;
  }

  public corporationCardsFromJSON(cards: Array<CardName>): Array<CorporationCard> {
    if (cards === undefined) {
      console.warn('missing cards calling corporationCardsFromJSON');
      return [];
    }
    const result: Array<CorporationCard> = [];
    cards.forEach((element: CardName) => {
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
