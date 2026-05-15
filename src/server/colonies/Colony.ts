import {GiveColonyBonus} from '../deferredActions/GiveColonyBonus';
import {IncreaseColonyTrack} from '../deferredActions/IncreaseColonyTrack';
import {LogHelper} from '../LogHelper';
import {MAX_COLONIES_PER_TILE, MAX_COLONY_TRACK_POSITION} from '../../common/constants';
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {PlayerInput} from '../PlayerInput';
import {Priority} from '../deferredActions/Priority';
import {Resource} from '../../common/Resource';
import {Tag} from '../../common/cards/Tag';
import {IGame} from '../IGame';
import {SerializedColony} from '../SerializedColony';
import {IColony, IColonyInternal, TradeOptions} from './IColony';
import {Benefit, ColonyMetadata, colonyMetadata, InputColonyMetadata} from '../../common/colonies/ColonyMetadata';
import {ColonyName} from '../../common/colonies/ColonyName';
import {CardName} from '../../common/cards/CardName';
import {benefitExecutors} from './benefits';

export abstract class Colony implements IColony, IColonyInternal {
  // Players can't build colonies on Miranda until someone has played an Animal card.
  // isActive is the gateway for that action and any other card with that type of constraint
  // also isActive represents when the colony is part of the game, or "back in the box", as it were.
  public isActive: boolean = true;
  public visitor: undefined | PlayerId = undefined;
  public colonies: Array<PlayerId> = [];
  public trackPosition: number = 1;

  public metadata: ColonyMetadata;

  protected constructor(metadata: InputColonyMetadata) {
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
        if (raider.tableau.has(CardName.HUAN)) {
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

    this.giveBonus(player, this.metadata.build, this.colonies.length);
    if (options?.giveBonusTwice === true) { // Vital Colony hook.
      this.giveBonus(player, this.metadata.build, this.colonies.length);
    }

    this.colonies.push(player.id);
    if (this.trackPosition < this.colonies.length) {
      this.trackPosition = this.colonies.length;
    }

    for (const cardOwner of player.game.players) {
      for (const card of cardOwner.tableau) {
        card.onColonyAddedByAnyPlayer?.(cardOwner, player);
      }
    }

    if (this.name === ColonyName.LEAVITT) {
      player.triggerOnNonCardTagAdded(Tag.SCIENCE);
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

    if (this.metadata.shouldIncreaseTrack === 'yes' || (this.metadata.trade.resource !== undefined && this.metadata.trade.resource[this.trackPosition] === this.metadata.trade.resource[maxPossibleTrackPosition])) {
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

  public handleTrade(player: IPlayer, options: TradeOptions) {
    this.giveBonus(player, this.metadata.trade, this.trackPosition);

    // !== false because default is true.
    if (options.giveColonyBonuses !== false) {
      player.game.defer(new GiveColonyBonus(player, this, options.selfishTrade));
    }

    // !== false because default is true.
    if (options.usesTradeFleet !== false) {
      this.visitor = player.id;
      player.colonies.usedTradeFleets++;
    }

    if (player.tableau.has(CardName.VENUS_TRADE_HUB)) {
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
    return this.giveBonus(player, this.metadata.colony, 0, isGiveColonyBonus);
  }

  private giveBonus(player: IPlayer, benefit: Benefit, index: number, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
    const quantity = Array.isArray(benefit.quantity) ? benefit.quantity[index] : benefit.quantity;
    const resource = Array.isArray(benefit.resource) ? benefit.resource[index] : benefit.resource;
    const action = benefitExecutors[benefit.type](player, this, quantity, resource);
    if (action !== undefined) {
      if (isGiveColonyBonus) {
        /*
         * When this method is called from within the GiveColonyBonus deferred action
         * we return the player input directly instead of deferring it.
         *
         * This is related to how certain colony bonuses require player interaction.
         * The deferred action queue doesn't work well when asking for inputs for
         * multiple players.
         */
        return action.execute();
      }
      player.game.defer(action);
    }
    return undefined;
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
