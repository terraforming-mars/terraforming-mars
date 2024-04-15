import {newProjectCard} from '../createCard';
import {SerializedCard} from '../SerializedCard';
import {isCeoCard} from './ceos/ICeoCard';
import {IProjectCard} from './IProjectCard';
import {isICloneTagCard} from './pathfinders/ICloneTagCard';
import {SelfReplicatingRobots} from './promo/SelfReplicatingRobots';
import {CardType} from '../../common/cards/CardType';

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
  if (card instanceof SelfReplicatingRobots) {
    serialized.targetCards = card.targetCards.map((t) => {
      return {
        card: {name: t.card.name},
        resourceCount: t.resourceCount,
      };
    });
  }
  if (isICloneTagCard(card)) {
    serialized.cloneTag = card.cloneTag;
  }
  if (isCeoCard(card)) {
    serialized.isDisabled = card.isDisabled;
    if (card.opgActionIsActive !== undefined) {
      serialized.opgActionIsActive = card.opgActionIsActive;
    }
  }
  if (card.data !== undefined) {
    serialized.data = card.data;
  }
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
  if (card instanceof SelfReplicatingRobots && element.targetCards !== undefined) {
    card.targetCards = [];
    element.targetCards.forEach((targetCard) => {
      const foundTargetCard = newProjectCard(targetCard.card.name);
      if (foundTargetCard !== undefined) {
        card.targetCards.push({
          card: foundTargetCard,
          resourceCount: targetCard.resourceCount,
        });
      } else {
        console.warn('did not find card for SelfReplicatingRobots', targetCard);
      }
    });
  }
  if (!(card instanceof SelfReplicatingRobots)) {
    if (element.bonusResource !== undefined) {
      card.bonusResource = Array.isArray(element.bonusResource) ? element.bonusResource : [element.bonusResource];
    }
  }
  if (isCeoCard(card)) {
    card.isDisabled = element.isDisabled;
    if (element.opgActionIsActive !== undefined) {
      card.opgActionIsActive = element.opgActionIsActive;
    }
  }
  return card;
}
