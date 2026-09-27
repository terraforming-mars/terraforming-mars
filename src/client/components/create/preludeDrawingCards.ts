import {CardName} from '@/common/cards/CardName';
import {CreateGameModel} from './CreateGameModel';

// By defining a subset of CreateGameModel testing is a little easier.
type Settings = Pick<CreateGameModel, 'expansions' | 'customPreludes' | 'customCorporations' | 'customCeos' | 'bannedCards' | 'includedCards'>;

/**
 * Cards that draw from the prelude deck and might be in this game. Only computed when
 * there is a custom prelude list, since that's when the deck could be too small.
 */
export function preludeDrawingCards(settings: Settings): Array<CardName> {
  // Short circuit - if there's no custom prelude length then
  // this isn't a problem.
  if (settings.customPreludes.length === 0) {
    return [];
  }
  const cards: Array<CardName> = [];
  if (settings.customCorporations.length === 0 || settings.customCorporations.includes(CardName.VALLEY_TRUST)) {
    cards.push(CardName.VALLEY_TRUST);
  }
  if (settings.customPreludes.includes(CardName.NEW_PARTNER)) {
    cards.push(CardName.NEW_PARTNER);
  }
  if (settings.customPreludes.includes(CardName.BOARD_OF_DIRECTORS)) {
    cards.push(CardName.BOARD_OF_DIRECTORS);
  }
  if (settings.expansions.turmoil) {
    if (settings.expansions.prelude2 || settings.includedCards.includes(CardName.WG_PROJECT)) {
      if (!settings.bannedCards.includes(CardName.WG_PROJECT)) {
        cards.push(CardName.WG_PROJECT);
      }
    }
  }
  if (settings.expansions.ceo) {
    if (settings.customCeos.length === 0 || settings.customCeos.includes(CardName.KAREN)) {
      cards.push(CardName.KAREN);
    }
  }
  return cards;
}
