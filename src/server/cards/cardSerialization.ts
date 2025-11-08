import {newCard, newCorporationCard, newProjectCard} from '../createCard';
import {SerializedCard} from '../SerializedCard';
import {IProjectCard, isIProjectCard} from './IProjectCard';
import {isICloneTagCard} from './pathfinders/ICloneTagCard';
import {CardType} from '../../common/cards/CardType';
import {asArray} from '../../common/utils/utils';
import {ICorporationCard, isICorporationCard} from './corporation/ICorporationCard';
import {isPreludeCard} from './prelude/IPreludeCard';
import {isCeoCard} from './ceos/ICeoCard';
import {ICard} from './ICard';
import {ProxyCard} from './ProxyCard';

export function serializeCard(card: ICard): SerializedCard {
  if (isICorporationCard(card)) {
    return serializeCorporationCard(card);
  } else if (isIProjectCard(card) || isPreludeCard(card) || isCeoCard(card) || card instanceof ProxyCard) {
    return serializeProjectCard(card);
  }
  throw new Error('Unknown card type ' + card.type + ' for ' + card.name);
}

export function deserializeCard(element: SerializedCard): IProjectCard | ICorporationCard {
  const card = newCard(element.name);
  if (card.type === CardType.CORPORATION) {
    return deserializeCorporationCard(element);
  } else {
    return deserializeProjectCard(element);
  }
}

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
