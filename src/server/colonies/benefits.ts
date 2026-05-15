import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {DeferredAction, SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {DiscardCards} from '../deferredActions/DiscardCards';
import {DrawCards} from '../deferredActions/DrawCards';
import {ErodeSpacesDeferred} from '../underworld/ErodeSpacesDeferred';
import {IColony, IColonyInternal} from './IColony';
import {IPlayer} from '../IPlayer';
import {PlaceHazardTile} from '../deferredActions/PlaceHazardTile';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {Priority} from '../deferredActions/Priority';
import {Resource} from '../../common/Resource';
import {ScienceTagCard} from '../cards/community/ScienceTagCard';
import {SelectColony} from '../inputs/SelectColony';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {StealResources} from '../deferredActions/StealResources';
import {Tag} from '../../common/cards/Tag';
import {TileType} from '../../common/TileType';
import {Turmoil} from '../turmoil/Turmoil';
import {message} from '../logs/MessageBuilder';
import {sum} from '../../common/utils/utils';

export type BenefitExecutor = (
  player: IPlayer,
  colony: IColony,
  quantity: number,
  resource: Resource | undefined,
) => DeferredAction<any> | undefined;

function addResourcesToCard(player: IPlayer, colony: IColony, quantity: number): DeferredAction<any> {
  return new AddResourcesToCard(player, colony.metadata.cardResource, {count: quantity});
}

function addResourcesToVenusCard(player: IPlayer, _colony: IColony, quantity: number): DeferredAction<any> {
  return new AddResourcesToCard(player, undefined, {
    count: quantity,
    restrictedTag: Tag.VENUS,
    title: message('Select Venus card to add ${0} resource(s)', (b) => b.number(quantity)),
  });
}

function copyTrade(player: IPlayer): DeferredAction<any> {
  const game = player.game;
  const openColonies = game.colonies.filter((colony) => colony.isActive);
  return new SimpleDeferredAction(
    player,
    () => new SelectColony('Select colony to gain trade income from', 'Select', openColonies)
      .andThen((colony: IColony) => {
        game.log('${0} gained ${1} trade bonus', (b) => b.player(player).colony(colony));
        (colony as IColony & IColonyInternal).handleTrade(player, {
          usesTradeFleet: false,
          decreaseTrackAfterTrade: false,
          giveColonyBonuses: false,
        });
        return undefined;
      }),
  );
}

function drawCards(player: IPlayer, _colony: IColony, quantity: number): DeferredAction<any> {
  return DrawCards.keepAll(player, quantity);
}

function drawCardsAndBuyOne(player: IPlayer): DeferredAction<any> {
  return DrawCards.keepSome(player, 1, {paying: true, logDrawnCard: true});
}

function drawCardsAndDiscardOne(player: IPlayer, colony: IColony): undefined {
  player.defer(() => {
    player.drawCard();
    player.game.defer(new DiscardCards(player, 1, 1, colony.name + ' colony bonus. Select a card to discard'), Priority.SUPERPOWER);
  });
  return undefined;
}

function drawCardsAndKeepOne(player: IPlayer, _colony: IColony, quantity: number): DeferredAction<any> {
  return DrawCards.keepSome(player, quantity, {keepMax: 1});
}

function erodeSpacesAdjacentToHazards(player: IPlayer, _colony: IColony, quantity: number): undefined {
  player.game.defer(new ErodeSpacesDeferred(player, quantity));
  return undefined;
}

function gainCardDiscount(player: IPlayer): undefined {
  player.colonies.cardDiscount += 1;
  player.game.log('Cards played by ${0} cost 1 M€ less this generation', (b) => b.player(player));
  return undefined;
}

function gainInfluence(player: IPlayer): undefined {
  Turmoil.ifTurmoil(player.game, (turmoil) => {
    turmoil.addInfluenceBonus(player);
    player.game.log('${0} gained 1 influence', (b) => b.player(player));
  });
  return undefined;
}

function gainMcPerHazardTile(player: IPlayer): undefined {
  player.stock.megacredits += player.game.board.getHazards().length;
  return undefined;
}

function gainProduction(player: IPlayer, _colony: IColony, quantity: number, resource: Resource | undefined): undefined {
  if (resource === undefined) {
    throw new Error('Resource cannot be undefined');
  }
  player.production.add(resource, quantity, {log: true});
  return undefined;
}

function gainResources(player: IPlayer, _colony: IColony, quantity: number, resource: Resource | undefined): undefined {
  if (resource === undefined) {
    throw new Error('Resource cannot be undefined');
  }
  player.stock.add(resource, quantity, {log: true});
  return undefined;
}

function gainScienceTag(player: IPlayer): undefined {
  player.tags.extraScienceTags += 1;
  player.playCard(new ScienceTagCard(), undefined, 'nothing');
  player.game.log('${0} gained 1 Science tag', (b) => b.player(player));
  return undefined;
}

function gainScienceTagsAndCloneTag(player: IPlayer): undefined {
  player.tags.extraScienceTags += 2;
  player.playCard(new ScienceTagCard(), undefined, 'nothing');
  player.game.log('${0} gained 2 Science tags', (b) => b.player(player));
  return undefined;
}

function gainTr(player: IPlayer, _colony: IColony, quantity: number): undefined {
  if (quantity > 0) {
    player.increaseTerraformRating(quantity, {log: true});
  }
  return undefined;
}

function gainVp(player: IPlayer, _colony: IColony, quantity: number): undefined {
  if (quantity > 0) {
    player.colonies.victoryPoints += quantity;
    player.game.log('${0} gained ${1} VP', (b) => b.player(player).number(quantity));
  }
  return undefined;
}

function giveMcPerDelegate(player: IPlayer): undefined {
  Turmoil.ifTurmoil(player.game, (turmoil) => {
    const partyDelegateCount = sum(turmoil.parties.map((party) => party.delegates.get(player)));
    player.stock.add(Resource.MEGACREDITS, partyDelegateCount, {log: true});
  });
  return undefined;
}

function increaseVenusScale(player: IPlayer, _colony: IColony, quantity: number): undefined {
  player.game.increaseVenusScaleLevel(player, quantity as 3|2|1);
  player.game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(quantity));
  return undefined;
}

function loseResources(player: IPlayer, _colony: IColony, quantity: number, resource: Resource | undefined): undefined {
  if (resource === undefined) {
    throw new Error('Resource cannot be undefined');
  }
  player.stock.deduct(resource, Math.min(player.stock.get(resource), quantity), {log: true});
  return undefined;
}

function opponentDiscard(player: IPlayer, colony: IColony): DeferredAction<any> | undefined {
  const game = player.game;
  if (game.isSoloMode()) {
    return undefined;
  }
  return new SimpleDeferredAction(
    player,
    () => {
      const playersWithCards = game.players.filter((p) => p.cardsInHand.length > 0);
      if (playersWithCards.length === 0) {
        return undefined;
      }
      return new SelectPlayer(playersWithCards, 'Select player to discard a card', 'Select')
        .andThen((selectedPlayer) => {
          game.defer(new DiscardCards(selectedPlayer, 1, 1, colony.name + ' colony effect. Select a card to discard'));
          return undefined;
        });
    });
}

function placeDelegates(player: IPlayer, _colony: IColony, quantity: number): undefined {
  Turmoil.ifTurmoil(player.game, (turmoil) => {
    const availablePlayerDelegates = turmoil.getAvailableDelegateCount(player);
    const qty = Math.min(quantity, availablePlayerDelegates);
    for (let i = 0; i < qty; i++) {
      player.game.defer(new SendDelegateToArea(player));
    }
  });
  return undefined;
}

function placeHazardTile(player: IPlayer): undefined {
  const game = player.game;
  const spaces = game.board.getAvailableSpacesOnLand(player)
    .filter((space) => space.tile === undefined)
    .filter((space) => {
      const adjacentSpaces = game.board.getAdjacentSpaces(space);
      return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
    });
  game.defer(new PlaceHazardTile(player, TileType.EROSION_MILD, {title: 'Select space next to no other tile for hazard', spaces}));
  return undefined;
}

function placeOceanTile(player: IPlayer): DeferredAction<any> {
  return new PlaceOceanTile(player);
}

function raisePlanetaryTrack(): never {
  throw new Error('raisePlanetaryTrack is not yet implemented');
}

function stealResources(player: IPlayer, _colony: IColony, quantity: number, resource: Resource | undefined): DeferredAction<any> {
  if (resource === undefined) {
    throw new Error('Resource cannot be undefined');
  }
  return new StealResources(player, resource, quantity);
}

export const benefitExecutors: Record<ColonyBenefit, BenefitExecutor> = {
  [ColonyBenefit.ADD_RESOURCES_TO_CARD]: addResourcesToCard,
  [ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD]: addResourcesToVenusCard,
  [ColonyBenefit.COPY_TRADE]: copyTrade,
  [ColonyBenefit.DRAW_CARDS]: drawCards,
  [ColonyBenefit.DRAW_CARDS_AND_BUY_ONE]: drawCardsAndBuyOne,
  [ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE]: drawCardsAndDiscardOne,
  [ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE]: drawCardsAndKeepOne,
  [ColonyBenefit.ERODE_SPACES_ADJACENT_TO_HAZARDS]: erodeSpacesAdjacentToHazards,
  [ColonyBenefit.GAIN_CARD_DISCOUNT]: gainCardDiscount,
  [ColonyBenefit.GAIN_INFLUENCE]: gainInfluence,
  [ColonyBenefit.GAIN_MC_PER_HAZARD_TILE]: gainMcPerHazardTile,
  [ColonyBenefit.GAIN_PRODUCTION]: gainProduction,
  [ColonyBenefit.GAIN_RESOURCES]: gainResources,
  [ColonyBenefit.GAIN_SCIENCE_TAG]: gainScienceTag,
  [ColonyBenefit.GAIN_SCIENCE_TAGS_AND_CLONE_TAG]: gainScienceTagsAndCloneTag,
  [ColonyBenefit.GAIN_TR]: gainTr,
  [ColonyBenefit.GAIN_VP]: gainVp,
  [ColonyBenefit.GIVE_MC_PER_DELEGATE]: giveMcPerDelegate,
  [ColonyBenefit.INCREASE_VENUS_SCALE]: increaseVenusScale,
  [ColonyBenefit.LOSE_RESOURCES]: loseResources,
  [ColonyBenefit.OPPONENT_DISCARD]: opponentDiscard,
  [ColonyBenefit.PLACE_DELEGATES]: placeDelegates,
  [ColonyBenefit.PLACE_HAZARD_TILE]: placeHazardTile,
  [ColonyBenefit.PLACE_OCEAN_TILE]: placeOceanTile,
  [ColonyBenefit.RAISE_PLANETARY_TRACK]: raisePlanetaryTrack,
  [ColonyBenefit.STEAL_RESOURCES]: stealResources,
};
