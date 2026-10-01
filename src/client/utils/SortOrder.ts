import {CardModel} from '@/common/models/CardModel';
import {comparing, compound, Comparator, reversed} from '@/common/utils/Ordering';
import {getCard} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {CardResource} from '@/common/CardResource';

export type SortKey = 'cost' | 'type' | 'resource' | 'vp';

export type SortOrder = {key: SortKey, reversed: boolean};

export const SORT_OPTIONS: ReadonlyArray<{key: SortKey, label: string}> = [
  {key: 'cost', label: 'Cost'},
  {key: 'type', label: 'Type'},
  {key: 'resource', label: 'Resource'},
  {key: 'vp', label: 'VP'},
];

const TYPE_ORDER: ReadonlyArray<CardType> = [CardType.CORPORATION, CardType.PRELUDE, CardType.AUTOMATED, CardType.ACTIVE, CardType.EVENT];
const RESOURCE_ORDER: ReadonlyArray<CardResource> = Object.values(CardResource);

function cost(card: CardModel): number {
  return card.calculatedCost ?? getCard(card.name)?.cost ?? 0;
}

/*
 * Position of the card's type when sorting: corporations, preludes, then green, blue, and red.
 *
 * Other types go last.
 */
function typeIndex(card: CardModel): number {
  const type = getCard(card.name)?.type;
  const index = type === undefined ? -1 : TYPE_ORDER.indexOf(type);
  return index === -1 ? TYPE_ORDER.length : index;
}

/*
 * Position of the resource the card holds when sorting, so cards holding the same resource sort together.
 *
 * Cards without resources go last.
 */
function resourceIndex(card: CardModel): number {
  const resourceType = getCard(card.name)?.resourceType;
  return resourceType === undefined ? RESOURCE_ORDER.length : RESOURCE_ORDER.indexOf(resourceType);
}

/*
 * Victory points the card sorts by.
 *
 * Fixed VP counts as its value. Variable VP (e.g. 1 VP per animal) can't be known in advance,
 * so it sorts after any card with fixed positive VP and before cards with none.
 */
function vp(card: CardModel): number {
  const victoryPoints = getCard(card.name)?.victoryPoints;
  if (victoryPoints === undefined) {
    return 0;
  }
  return typeof victoryPoints === 'number' ? victoryPoints : 0.5;
}

const COMPARATORS: Record<SortKey, Comparator<CardModel>> = {
  cost: comparing(cost),
  type: compound(comparing(typeIndex), comparing(cost)),
  resource: compound(comparing(resourceIndex), comparing(cost)),
  vp: compound(comparing((card) => -vp(card)), comparing(cost)),
};

/**
 * Sort selected by clicking the `key` button.
 *
 * Clicking the current sort again flips its direction.
 */
export function sortOrderClicked(current: SortOrder | undefined, key: SortKey): SortOrder {
  return {key, reversed: current?.key === key && !current.reversed};
}

/**
 * Sorts a copy of `cards` by `sortOrder`.
 *
 * Cards that tie keep their order from `cards`.
 */
export function sortCards(cards: ReadonlyArray<CardModel>, sortOrder: SortOrder): Array<CardModel> {
  const comparator = sortOrder.reversed ? reversed(COMPARATORS[sortOrder.key]) : COMPARATORS[sortOrder.key];
  return [...cards].sort(comparator);
}
