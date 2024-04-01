import {ICard} from './cards/ICard';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {CardName} from '../common/cards/CardName';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {ICeoCard} from './cards/ceos/ICeoCard';
import {ALL_MODULE_MANIFESTS} from './cards/AllManifests';

const CARD_RENAMES = new Map<string, CardName>([
  // When renaming a card, add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.

  // TODO(yournamehere): remove after 2021-04-05
  // ['Earth Embasy', CardName.EARTH_EMBASSY],
]);

function _createCard<T extends ICard>(cardName: CardName, cardManifestNames: Array<keyof ModuleManifest>): T | undefined {
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

export function newCard(cardName: CardName): ICard | undefined {
  return _createCard(cardName, ['corporationCards', 'projectCards', 'preludeCards', 'ceoCards']);
}

export function newCorporationCard(cardName: CardName): ICorporationCard | undefined {
  return _createCard(cardName, ['corporationCards']);
}

// Function to return a card object by its name
// NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
// TODO(kberg+dl): Find the use cases where this is used to find Prelude+CEO cards and filter them out to
//              another function, perhaps?
export function newProjectCard(cardName: CardName): IProjectCard | undefined {
  return _createCard(cardName, ['projectCards', 'preludeCards', 'ceoCards']);
}

export function newPrelude(cardName: CardName): IPreludeCard | undefined {
  return _createCard(cardName, ['preludeCards']);
}

export function newCeo(cardName: CardName): ICeoCard | undefined {
  return _createCard(cardName, ['ceoCards']);
}

export function preludesFromJSON(cards: Array<CardName>): Array<IPreludeCard> {
  if (cards === undefined) {
    console.warn('missing cards calling cardsFromJSON');
    return [];
  }
  const result: Array<IPreludeCard> = [];
  cards.forEach((element: CardName) => {
    const card = newPrelude(element);
    if (card !== undefined) {
      result.push(card);
    } else {
      console.warn(`card ${element} not found while loading game.`);
    }
  });
  return result;
}

export function ceosFromJSON(cards: Array<CardName>): Array<ICeoCard> {
  if (cards === undefined) {
    console.warn('missing cards calling ceosFromJSON');
    return [];
  }
  const result: Array<ICeoCard> = [];
  cards.forEach((element: CardName) => {
    const card = newCeo(element);
    if (card !== undefined) {
      result.push(card);
    } else {
      console.warn(`card ${element} not found while loading game.`);
    }
  });
  return result;
}

export function cardsFromJSON(cards: Array<CardName>): Array<IProjectCard> {
  if (cards === undefined) {
    console.warn('missing cards calling cardsFromJSON');
    return [];
  }
  const result: Array<IProjectCard> = [];
  cards.forEach((element: CardName) => {
    const card = newProjectCard(element);
    if (card !== undefined) {
      result.push(card);
    } else {
      console.warn(`card ${element} not found while loading game.`);
    }
  });
  return result;
}

export function corporationCardsFromJSON(cards: Array<CardName>): Array<ICorporationCard> {
  if (cards === undefined) {
    console.warn('missing cards calling corporationCardsFromJSON');
    return [];
  }
  const result: Array<ICorporationCard> = [];
  cards.forEach((element: CardName) => {
    const card = newCorporationCard(element);
    if (card !== undefined) {
      result.push(card);
    } else {
      console.warn(`corporation ${element} not found while loading game.`);
    }
  });
  return result;
}
