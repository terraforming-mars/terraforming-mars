import {CardModel} from '../../common/models/CardModel';
import {ICard} from '../cards/ICard';
import {isIProjectCard} from '../cards/IProjectCard';
import {isICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {Player} from '../Player';
import {Units} from '../../common/Units';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';


export class CardModels {
  public static getCards(
    player: Player,
    cards: Array<ICard>,
    options: {
      showResources?: boolean,
      showCalculatedCost?: boolean,
      reserveUnits?: Array<Units>,
      enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
    } = {},
  ): Array<CardModel> {
    return cards.map((card, index) => {
      let discount = card.cardDiscount === undefined ? undefined : (Array.isArray(card.cardDiscount) ? card.cardDiscount : [card.cardDiscount]);

      // Too bad this is hard-coded
      if (card.name === CardName.CRESCENT_RESEARCH_ASSOCIATION) {
        discount = [{tag: Tag.MOON, amount: player.tags.count(Tag.MOON)}];
      }
      if (card.name === CardName.MARS_DIRECT) {
        discount = [{tag: Tag.MARS, amount: player.tags.count(Tag.MARS)}];
      }

      const isDisabled = isICorporationCard(card) ? (card.isDisabled || false) : (options.enabled?.[index] === false);

      const model: CardModel = {
        resources: options.showResources ? card.resourceCount : undefined,
        name: card.name,
        calculatedCost: options.showCalculatedCost ? (isIProjectCard(card) && card.cost !== undefined ? player.getCardCost(card) : undefined) : card.cost,
        cardType: card.cardType,
        isDisabled: isDisabled,
        warning: card.warning,
        reserveUnits: options.reserveUnits ? options.reserveUnits[index] : Units.EMPTY,
        bonusResource: isIProjectCard(card) ? card.bonusResource : undefined,
        discount: discount,
        cloneTag: isICloneTagCard(card) ? card.cloneTag : undefined,
      };
      return model;
    });
  }
}
