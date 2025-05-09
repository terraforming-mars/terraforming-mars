import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {DeferredAction, SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {Priority} from '../deferredActions/Priority';
import {DiscardCards} from '../deferredActions/DiscardCards';
import {DrawCards} from '../deferredActions/DrawCards';
import {GiveColonyBonus} from '../deferredActions/GiveColonyBonus';
import {IncreaseColonyTrack} from '../deferredActions/IncreaseColonyTrack';
import {LogHelper} from '../LogHelper';
import {MAX_COLONIES_PER_TILE, MAX_COLONY_TRACK_POSITION} from '../../common/constants';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {PlayerInput} from '../PlayerInput';
import {Resource} from '../../common/Resource';
import {ScienceTagCard} from '../cards/community/ScienceTagCard';
import {SelectColony} from '../inputs/SelectColony';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {StealResources} from '../deferredActions/StealResources';
import {Tag} from '../../common/cards/Tag';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {IGame} from '../IGame';
import {Turmoil} from '../turmoil/Turmoil';
import {SerializedColony} from '../SerializedColony';
import {IColony, TradeOptions} from './IColony';
import {colonyMetadata, IColonyMetadata, IInputColonyMetadata} from '../../common/colonies/IColonyMetadata';
import {ColonyName} from '../../common/colonies/ColonyName';
import {sum} from '../../common/utils/utils';
import {message} from '../logs/MessageBuilder';
import {PlaceHazardTile} from '../deferredActions/PlaceHazardTile';
import {TileType} from '../../../src/common/TileType';
import {ErodeSpacesDeferred} from '../underworld/ErodeSpacesDeferred';
import {CardName} from '../../common/cards/CardName';

export enum ShouldIncreaseTrack { YES, NO, ASK }
export abstract class Colony implements IColony {
  // Players can't build colonies on Miranda until someone has played an Animal card.
  // isActive is the gateway for that action and any other card with that type of constraint
  // also isActive represents when the colony is part of the game, or "back in the box", as it were.
  public isActive: boolean = true;
  public visitor: undefined | PlayerId = undefined;
  public colonies: Array<PlayerId> = [];
  public trackPosition: number = 1;

  public metadata: IColonyMetadata;

  protected constructor(metadata: IInputColonyMetadata) {
    this.metadata = colonyMetadata(metadata);
  }

  public get name(): ColonyName {
    return this.metadata.name;
  }

  public endGeneration(game: IGame): void {
    if (this.isActive) {
      this.increaseTrack();
    }
    // Syndicate Pirate Raids hook. If it is in effect, then only the syndicate pirate raider will
    // retrieve their fleets.
    // See Player.ts for the other half of this effect, and Game.ts which disables it.
    if (game.syndicatePirateRaider) {
      if (game.syndicatePirateRaider === this.visitor) {
        this.visitor = undefined;
      } else {
        const raider = game.getPlayerById(game.syndicatePirateRaider);
        if (raider.cardIsInEffect(CardName.HUAN)) {
          this.visitor = undefined;
        }
      }
    } else {
      this.visitor = undefined;
    }
  }

  public increaseTrack(value: number = 1): void {
    this.trackPosition = Math.min(this.trackPosition + value, MAX_COLONY_TRACK_POSITION);
  }

  public decreaseTrack(value: number = 1): void {
    this.trackPosition = Math.max(this.trackPosition - value, this.colonies.length);
  }

  public isFull(): boolean {
    return this.colonies.length >= MAX_COLONIES_PER_TILE;
  }

  public addColony(player: IPlayer, options?: {giveBonusTwice: boolean}): void {
    player.game.log('${0} built a colony on ${1}', (b) => b.player(player).colony(this));

    this.giveBonus(player, this.metadata.buildType, this.metadata.buildQuantity[this.colonies.length], this.metadata.buildResource);
    if (options?.giveBonusTwice === true) { // Vital Colony hook.
      this.giveBonus(player, this.metadata.buildType, this.metadata.buildQuantity[this.colonies.length], this.metadata.buildResource);
    }

    this.colonies.push(player.id);
    if (this.trackPosition < this.colonies.length) {
      this.trackPosition = this.colonies.length;
    }

    for (const cardOwner of player.game.getPlayers()) {
      for (const card of cardOwner.tableau) {
        card.onColonyAdded?.(player, cardOwner);
      }
    }

    if (this.name === ColonyName.LEAVITT) {
      for (const card of player.tableau) {
        card.onColonyAddedToLeavitt?.(player);
      }
    }
  }

  /*
    * Trade with this colony.
    *
    * Before passing off the trade, this determines whether the track should advance prior to trading, and then
    * hands off the real work to `handleTrade`.
    *
    * @param bonusTradeOffset an offset that allows a player to increase the colony tile track marker before trading.
    * @param usesTradeFleet when false, the player can trade without an available trade fleet.
    * @param decreaseTrackAfterTrade when false, the track does not decrease after trading.
    */
  public trade(player: IPlayer, tradeOptions: TradeOptions = {}, bonusTradeOffset = 0): void {
    const tradeOffset = player.colonies.tradeOffset + bonusTradeOffset;
    const maxPossibleTrackPosition = Math.min(this.trackPosition + tradeOffset, MAX_COLONY_TRACK_POSITION);
    const steps = maxPossibleTrackPosition - this.trackPosition;

    if (steps === 0 ||
        this.metadata.shouldIncreaseTrack === 'no' ||
        tradeOptions.selfishTrade === true) {
      // Don't increase
      this.handleTrade(player, tradeOptions);
      return;
    }

    if (this.metadata.shouldIncreaseTrack === 'yes' || (this.metadata.tradeResource !== undefined && this.metadata.tradeResource[this.trackPosition] === this.metadata.tradeResource[maxPossibleTrackPosition])) {
      // No point in asking the player, just increase it
      this.increaseTrack(steps);
      LogHelper.logColonyTrackIncrease(player, this, steps);
      this.handleTrade(player, tradeOptions);
      return;
    }

    // Ask the player if they want to increase the track
    player.game.defer(new IncreaseColonyTrack(player, this, steps))
      .andThen(() => this.handleTrade(player, tradeOptions));
  }

  private handleTrade(player: IPlayer, options: TradeOptions) {
    const resource = Array.isArray(this.metadata.tradeResource) ? this.metadata.tradeResource[this.trackPosition] : this.metadata.tradeResource;

    this.giveBonus(player, this.metadata.tradeType, this.metadata.tradeQuantity[this.trackPosition], resource);

    // !== false because default is true.
    if (options.giveColonyBonuses !== false) {
      player.game.defer(new GiveColonyBonus(player, this, options.selfishTrade));
    }

    // !== false because default is true.
    if (options.usesTradeFleet !== false) {
      this.visitor = player.id;
      player.colonies.tradesThisGeneration++;
    }

    if (player.cardIsInEffect(CardName.VENUS_TRADE_HUB)) {
      player.stock.add(Resource.MEGACREDITS, 3, {log: true});
    }

    // !== false because default is true.
    if (options.decreaseTrackAfterTrade !== false) {
      player.defer(() => {
        this.trackPosition = this.colonies.length;
      }, Priority.DECREASE_COLONY_TRACK_AFTER_TRADE);
    }
  }

  public giveColonyBonus(player: IPlayer, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
    return this.giveBonus(player, this.metadata.colonyBonusType, this.metadata.colonyBonusQuantity, this.metadata.colonyBonusResource, isGiveColonyBonus);
  }

  private giveBonus(player: IPlayer, bonusType: ColonyBenefit, quantity: number, resource: Resource | undefined, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
    const game = player.game;

    let action: undefined | DeferredAction<any> = undefined;
    switch (bonusType) {
    case ColonyBenefit.ADD_RESOURCES_TO_CARD:
      const cardResource = this.metadata.cardResource;
      action = new AddResourcesToCard(player, cardResource, {count: quantity});
      break;

    case ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD:
      action = new AddResourcesToCard(
        player,
        undefined,
        {
          count: quantity,
          restrictedTag: Tag.VENUS,
          title: message('Select Venus card to add ${0} resource(s)', (b) => b.number(quantity)),
        });
      break;

    case ColonyBenefit.COPY_TRADE:
      const openColonies = game.colonies.filter((colony) => colony.isActive);
      action = new SimpleDeferredAction(
        player,
        () => new SelectColony('Select colony to gain trade income from', 'Select', openColonies)
          .andThen((colony) => {
            game.log('${0} gained ${1} trade bonus', (b) => b.player(player).colony(colony));
            (colony as Colony).handleTrade(player, {
              usesTradeFleet: false,
              decreaseTrackAfterTrade: false,
              giveColonyBonuses: false,
            });
            return undefined;
          }),
      );
      break;

    case ColonyBenefit.DRAW_CARDS:
      action = DrawCards.keepAll(player, quantity);
      break;

    case ColonyBenefit.DRAW_CARDS_AND_BUY_ONE:
      action = DrawCards.keepSome(player, 1, {paying: true, logDrawnCard: true});
      break;

    case ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE:
      player.defer(() => {
        player.drawCard();
        player.game.defer(new DiscardCards(player, 1, 1, this.name + ' colony bonus. Select a card to discard'), Priority.SUPERPOWER);
      });
      break;

    case ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE:
      action = DrawCards.keepSome(player, quantity, {keepMax: 1});
      break;

    case ColonyBenefit.GAIN_CARD_DISCOUNT:
      player.colonies.cardDiscount += 1;
      game.log('Cards played by ${0} cost 1 M€ less this generation', (b) => b.player(player));
      break;

    case ColonyBenefit.GAIN_PRODUCTION:
      if (resource === undefined) throw new Error('Resource cannot be undefined');
      player.production.add(resource, quantity, {log: true});
      break;

    case ColonyBenefit.GAIN_RESOURCES:
      if (resource === undefined) throw new Error('Resource cannot be undefined');
      player.stock.add(resource, quantity, {log: true});
      break;

    case ColonyBenefit.GAIN_SCIENCE_TAG:
      player.tags.gainScienceTag(1);
      player.playCard(new ScienceTagCard(), undefined, 'nothing');
      game.log('${0} gained 1 Science tag', (b) => b.player(player));
      break;

    case ColonyBenefit.GAIN_SCIENCE_TAGS_AND_CLONE_TAG:
      player.tags.gainScienceTag(2);
      player.playCard(new ScienceTagCard(), undefined, 'nothing');
      game.log('${0} gained 2 Science tags', (b) => b.player(player));
      break;

    case ColonyBenefit.GAIN_INFLUENCE:
      Turmoil.ifTurmoil(game, (turmoil) => {
        turmoil.addInfluenceBonus(player);
        game.log('${0} gained 1 influence', (b) => b.player(player));
      });
      break;

    case ColonyBenefit.PLACE_DELEGATES:
      Turmoil.ifTurmoil(game, (turmoil) => {
        const availablePlayerDelegates = turmoil.getAvailableDelegateCount(player);
        const qty = Math.min(quantity, availablePlayerDelegates);
        for (let i = 0; i < qty; i++) {
          game.defer(new SendDelegateToArea(player));
        }
      });
      break;

    case ColonyBenefit.GIVE_MC_PER_DELEGATE:
      Turmoil.ifTurmoil(game, (turmoil) => {
        const partyDelegateCount = sum(turmoil.parties.map((party) => party.delegates.get(player)));
        player.stock.add(Resource.MEGACREDITS, partyDelegateCount, {log: true});
      });
      break;

    case ColonyBenefit.PLACE_HAZARD_TILE:
      const spaces = game.board.getAvailableSpacesOnLand(player)
        .filter(((space) => space.tile === undefined))
        .filter((space) => {
          const adjacentSpaces = game.board.getAdjacentSpaces(space);
          return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
        });

      game.defer(new PlaceHazardTile(player, TileType.EROSION_MILD, {title: 'Select space next to no other tile for hazard', spaces}));
      break;

    case ColonyBenefit.ERODE_SPACES_ADJACENT_TO_HAZARDS:
      game.defer(new ErodeSpacesDeferred(player, quantity));
      break;

    case ColonyBenefit.GAIN_MC_PER_HAZARD_TILE:
      player.stock.megacredits += game.board.getHazards().length;
      break;

    case ColonyBenefit.GAIN_TR:
      if (quantity > 0) {
        player.increaseTerraformRating(quantity, {log: true});
      }
      break;

    case ColonyBenefit.GAIN_VP:
      if (quantity > 0) {
        player.colonies.victoryPoints += quantity;
        game.log('${0} gained ${1} VP', (b) => b.player(player).number(quantity));
      }
      break;

    case ColonyBenefit.INCREASE_VENUS_SCALE:
      game.increaseVenusScaleLevel(player, quantity as 3|2|1);
      game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(quantity));
      break;

    case ColonyBenefit.LOSE_RESOURCES:
      if (resource === undefined) {
        throw new Error('Resource cannot be undefined');
      }
      player.stock.deduct(resource, Math.min(player.stock.get(resource), quantity), {log: true});
      break;

    case ColonyBenefit.OPPONENT_DISCARD:
      if (game.isSoloMode()) break;
      action = new SimpleDeferredAction(
        player,
        () => {
          const playersWithCards = game.getPlayers().filter((p) => p.cardsInHand.length > 0);
          if (playersWithCards.length === 0) return undefined;
          return new SelectPlayer(playersWithCards, 'Select player to discard a card', 'Select')
            .andThen((selectedPlayer) => {
              game.defer(new DiscardCards(selectedPlayer, 1, 1, this.name + ' colony effect. Select a card to discard'));
              return undefined;
            });
        });
      break;

    case ColonyBenefit.PLACE_OCEAN_TILE:
      action = new PlaceOceanTile(player);
      break;

    case ColonyBenefit.STEAL_RESOURCES:
      if (resource === undefined) throw new Error('Resource cannot be undefined');
      action = new StealResources(player, resource, quantity);
      break;

    default:
      throw new Error('Unsupported benefit type');
    }

    if (action !== undefined) {
      if (isGiveColonyBonus) {
        /*
         * When this method is called from within the GiveColonyBonus deferred action
         * we return the player input directly instead of deferring it.
         *
         * TODO(kberg): why?
         */
        return action.execute();
      } else {
        game.defer(action);
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  public serialize(): SerializedColony {
    return {
      name: this.name,
      colonies: this.colonies,
      isActive: this.isActive,
      trackPosition: this.trackPosition,
      visitor: this.visitor,
    };
  }
}
