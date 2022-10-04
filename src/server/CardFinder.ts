import {ICard} from './cards/ICard';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {CardName} from '../common/cards/CardName';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {ALL_MODULE_MANIFESTS} from './cards/AllCards';

const CARD_RENAMES = new Map<string, CardName>([
  // When renaming a card, add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in CardFinder.spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // ['Earth Embasy', CardName.EARTH_EMBASSY],

  // TODO(kberg): remove after 2022-11-01
  ['Designed Micro-organisms', CardName.DESIGNED_MICROORGANISMS],
  ['Refugee Camp', CardName.REFUGEE_CAMPS],
  ['Allied Banks', CardName.ALLIED_BANK],
  ['Inventors Guild', CardName.INVENTORS_GUILD],
  ['Cryo Sleep', CardName.CRYO_SLEEP],
]);

export class CardFinder {
  private getCard<T extends ICard>(cardName: CardName, cardManifestNames: Array<keyof ModuleManifest>): T | undefined {
    const standardizedCardName = CARD_RENAMES.get(cardName) || cardName;

    for (const moduleManifest of ALL_MODULE_MANIFESTS) {
      for (const manifestName of cardManifestNames) {
        const cardManifest = <CardManifest<T>> moduleManifest[manifestName];
        const factory = cardManifest[standardizedCardName];
        if (factory !== undefined) {
          return new factory.Factory();
        }
      }
    }
    console.warn(`card not found ${cardName}`);
    return undefined;
  }

  public getCardByName(cardName: CardName): ICard | undefined {
    return this.getCard(cardName, ['corporationCards', 'projectCards', 'preludeCards']);
  }

  public getCorporationCardByName(cardName: CardName): ICorporationCard | undefined {
    return this.getCard(cardName, ['corporationCards']);
  }

  // Function to return a card object by its name
  // NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
  // TODO(kberg): Find the use cases where this is used to find Prelude cards and filter them out to
  //              another function, perhaps?
  public getProjectCardByName(cardName: CardName): IProjectCard | undefined {
    return this.getCard(cardName, ['projectCards', 'preludeCards']);
  }

  public getPreludeByName(cardName: CardName): IPreludeCard | undefined {
    return this.getCard(cardName, ['preludeCards']);
  }

  public preludesFromJSON(cards: Array<CardName>): Array<IPreludeCard> {
    if (cards === undefined) {
      console.warn('missing cards calling cardsFromJSON');
      return [];
    }
    const result: Array<IPreludeCard> = [];
    cards.forEach((element: CardName) => {
      const card = this.getPreludeByName(element);
      if (card !== undefined) {
        result.push(card);
      } else {
        console.warn(`card ${element} not found while loading game.`);
      }
    });
    return result;
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

  public corporationCardsFromJSON(cards: Array<CardName>): Array<ICorporationCard> {
    if (cards === undefined) {
      console.warn('missing cards calling corporationCardsFromJSON');
      return [];
    }
    const result: Array<ICorporationCard> = [];
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
