import {CardModel} from '../../common/models/CardModel';
import {ColonyModel} from '../../common/models/ColonyModel';
import {Color} from '../../common/Color';
import {IGame} from '../IGame';
import {ICard} from '../cards/ICard';
import {isIProjectCard} from '../cards/IProjectCard';
import {isICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {IPlayer} from '../IPlayer';
import {PlayCardMetadata} from '../inputs/SelectProjectCardToPlay';
import {IColony} from '../colonies/IColony';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';

export function cardsToModel(
  player: IPlayer,
  cards: ReadonlyArray<ICard>,
  options: {
    showResources?: boolean,
    showCalculatedCost?: boolean,
    extras?: Map<CardName, PlayCardMetadata>,
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

    let warning = undefined;
    const playCardMetadata = options?.extras?.get(card.name);
    if (typeof(playCardMetadata?.details) === 'object') {
      const thinkTankResources = playCardMetadata?.details.thinkTankResources;
      if ((thinkTankResources ?? 0) > 0) {
        warning = `Playing ${card.name} Consumes ${thinkTankResources} data from Think Tank`;
      }
    }

    const model: CardModel = {
      resources: options.showResources ? card.resourceCount : undefined,
      name: card.name,
      calculatedCost: options.showCalculatedCost ? (isIProjectCard(card) && card.cost !== undefined ? player.getCardCost(card) : undefined) : card.cost,
      warning: warning,
      bonusResource: isIProjectCard(card) ? card.bonusResource : undefined,
      discount: discount,
      cloneTag: isICloneTagCard(card) ? card.cloneTag : undefined,
    };
    const isDisabled = isICorporationCard(card) ? (card.isDisabled || false) : (options.enabled?.[index] === false);
    if (isDisabled === true) {
      model.isDisabled = true;
    }
    const reserveUnits = playCardMetadata?.reserveUnits;
    if (reserveUnits !== undefined) {
      model.reserveUnits = reserveUnits;
    }
    if (card.warnings.size > 0) {
      model.warnings = Array.from(card.warnings);
    }
    return model;
  });
}

/**
 * No need for both isActive and showTitleOnly.
 */
export function coloniesToModel(game: IGame, colonies: Array<IColony>, showTileOnly: boolean, isActive: boolean = true) : Array<ColonyModel> {
  return colonies.map(
    (colony): ColonyModel => ({
      colonies: colony.colonies.map(
        (playerId): Color => game.getPlayerById(playerId).color,
      ),
      isActive: isActive && colony.isActive && showTileOnly === false,
      name: colony.name,
      trackPosition: colony.trackPosition,
      visitor:
        colony.visitor === undefined ?
          undefined :
          game.getPlayerById(colony.visitor).color,
    }),
  );
}
