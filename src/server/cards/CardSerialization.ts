import {CardFinder} from '../CardFinder';
import {SerializedCard} from '../SerializedCard';
import {MiningCard} from './base/MiningCard';
import {IProjectCard} from './IProjectCard';
import {isICloneTagCard} from './pathfinders/ICloneTagCard';
import {SelfReplicatingRobots} from './promo/SelfReplicatingRobots';

export function serializeProjectCard(c: IProjectCard): SerializedCard {
  const result: SerializedCard = {
    name: c.name,
  };
  if (c.bonusResource !== undefined) {
    result.bonusResource = c.bonusResource;
  }
  if (c.resourceCount !== undefined) {
    result.resourceCount = c.resourceCount;
  }
  if (c instanceof SelfReplicatingRobots) {
    result.targetCards = c.targetCards.map((t) => {
      return {
        card: {name: t.card.name},
        resourceCount: t.resourceCount,
      };
    });
  }
  if (isICloneTagCard(c)) {
    result.cloneTag = c.cloneTag;
  }
  return result;
}

export function deserializeProjectCard(element: SerializedCard, cardFinder: CardFinder): IProjectCard {
  const card = cardFinder.getProjectCardByName(element.name);
  if (card === undefined) {
    throw new Error(`Card ${element.name} not found`);
  }
  if (element.resourceCount !== undefined) {
    card.resourceCount = element.resourceCount;
  }
  if (isICloneTagCard(card) && element.cloneTag !== undefined) {
    card.cloneTag = element.cloneTag;
  }
  if (card instanceof SelfReplicatingRobots && element.targetCards !== undefined) {
    card.targetCards = [];
    element.targetCards.forEach((targetCard) => {
      const foundTargetCard = cardFinder.getProjectCardByName(targetCard.card.name);
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
  if (card instanceof MiningCard && element.bonusResource !== undefined) {
    card.bonusResource = Array.isArray(element.bonusResource) ? element.bonusResource : [element.bonusResource];
  }
  return card;
}
