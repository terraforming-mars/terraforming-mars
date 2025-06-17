import {newCorporationCard, newProjectCard} from '../createCard';
import {SerializedCard} from '../SerializedCard';
import {IProjectCard} from './IProjectCard';
import {isICloneTagCard} from './pathfinders/ICloneTagCard';
import {CardType} from '../../common/cards/CardType';
import {asArray} from '../../common/utils/utils';
import {ICorporationCard} from './corporation/ICorporationCard';

export function serializeProjectCard(card: IProjectCard): SerializedCard {
  const serialized: SerializedCard = {
    name: card.name,
  };
  if (card.type === CardType.PROXY) {
    return serialized;
  }
  if (card.bonusResource !== undefined) {
    serialized.bonusResource = card.bonusResource;
  }
  if (card.resourceCount !== undefined) {
    serialized.resourceCount = card.resourceCount;
  }
  if (card.generationUsed !== undefined) {
    serialized.generationUsed = card.generationUsed;
  }
  if (isICloneTagCard(card)) {
    serialized.cloneTag = card.cloneTag;
  }
  if (card.data !== undefined) {
    serialized.data = card.data;
  }
  card.serialize?.(serialized);
  return serialized;
}

export function deserializeProjectCard(element: SerializedCard): IProjectCard {
  const card = newProjectCard(element.name);
  if (card === undefined) {
    throw new Error(`Card ${element.name} not found`);
  }
  if (element.resourceCount !== undefined) {
    card.resourceCount = element.resourceCount;
  }
  if (card.hasOwnProperty('data')) {
    card.data = element.data;
  }
  if (element.generationUsed !== undefined) {
    card.generationUsed = element.generationUsed;
  }
  if (isICloneTagCard(card) && element.cloneTag !== undefined) {
    card.cloneTag = element.cloneTag;
  }
  if (element.bonusResource !== undefined) {
    card.bonusResource = asArray(element.bonusResource);
  }
  card.deserialize?.(element);
  return card;
}

export function serializeCorporationCard(card: ICorporationCard): SerializedCard {
  const serialized = {
    name: card.name,
    resourceCount: card.resourceCount,
    isDisabled: false,
  };
  card.serialize?.(serialized);
  return serialized;
}

export function deserializeCorporationCard(element: SerializedCard): ICorporationCard {
  const card = newCorporationCard(element.name);
  if (card === undefined) {
    throw new Error(`Card ${element.name} not found`);
  }
  if (element.resourceCount !== undefined) {
    card.resourceCount = element.resourceCount;
  }
  card.deserialize?.(element);
  return card;
}
