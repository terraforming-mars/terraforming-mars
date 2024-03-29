import {CardModel} from '../../common/models/CardModel';
import {ColonyModel} from '../../common/models/ColonyModel';
import {Color} from '../../common/Color';
import {IGame} from '../IGame';
import {ICard} from '../cards/ICard';
import {isIProjectCard} from '../cards/IProjectCard';
import {isICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {IPlayer} from '../IPlayer';
import {IColony} from '../colonies/IColony';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';

export type Options = {
  showResources?: boolean,
  showCalculatedCost?: boolean,
  enabled?: Map<CardName, boolean>,
  showOwner?: boolean
}

export function cardsToModel(player: IPlayer, cards: ReadonlyArray<ICard>, options: Options = {}): Array<CardModel> {
  return cards.map((card) => cardToModel(card, player, options));
}

export function cardToModel(card: ICard, player: IPlayer, options: Options): CardModel {
  let discount = card.cardDiscount === undefined ? undefined : (Array.isArray(card.cardDiscount) ? card.cardDiscount : [card.cardDiscount]);

    // Too bad this is hard-coded
    if (card.name === CardName.CRESCENT_RESEARCH_ASSOCIATION) {
      discount = [{tag: Tag.MOON, amount: player.tags.count(Tag.MOON)}];
    }
    if (card.name === CardName.MARS_DIRECT) {
      discount = [{tag: Tag.MARS, amount: player.tags.count(Tag.MARS)}];
    }

    let warning: string | undefined;
    /*const thinkTankResources = playCardMetadata.details.thinkTankResources;
      if ((thinkTankResources ?? 0) > 0) {
        warning = `Playing ${card.name} consumes ${thinkTankResources} data from Think Tank`;
      }*/
    let redsCost = player.getRedsCostForCard(card)
    if (redsCost > 0) {
      warning = `Playing ${card.name} will cost ${redsCost} M€ more because Reds are in power`;
    }

    const model: CardModel = {
      resources: options.showResources ? card.resourceCount : undefined,
      name: card.name,
      calculatedCost: options.showCalculatedCost ? (isIProjectCard(card) && card.cost !== undefined ? player.getCardCost(card) : undefined) : card.cost,
      warning: warning,
      bonusResource: isIProjectCard(card) ? card.bonusResource : undefined,
      discount: discount,
      cloneTag: isICloneTagCard(card) ? card.cloneTag : undefined,
      showOwner: options.showOwner
    };
    const enabled = options?.enabled?.get(card.name);
    if (card.isDisabled || enabled === false) {
      model.isDisabled = true;
    }
    if (card.warnings.size > 0) {
      model.warnings = Array.from(card.warnings);
    }
    return model;
}

export function coloniesToModel(game: IGame, colonies: Array<IColony>, showTileOnly: boolean) : Array<ColonyModel> {
  return colonies.map(
    (colony): ColonyModel => (colonyToModel(game, colony, showTileOnly)),
  );
}

export function colonyToModel(game: IGame, colony: IColony, showTileOnly: boolean): ColonyModel {
  return {
    colonies: colony.colonies.map(
      (playerId): Color => game.getPlayerById(playerId).color,
    ),
    isActive: colony.isActive && showTileOnly === false,
    name: colony.name,
    trackPosition: colony.trackPosition,
    visitor:
      colony.visitor === undefined ?
        undefined :
        game.getPlayerById(colony.visitor).color,
  }
}
