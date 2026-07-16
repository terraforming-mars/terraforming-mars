import {LawSuit} from '../cards/promo/LawSuit';
import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {CrashSiteCleanup} from '../cards/promo/CrashSiteCleanup';
import {From, isFromPlayer} from '../logs/From';
import {BaseStock} from './StockBase';

export class Stock extends BaseStock {
  public add(
    resource: Resource,
    amount : number,
    options? : {
      log?: boolean,
      from? : From,
      stealing?: boolean
    }) {
    if (amount === 0) {
      return;
    }
    // When amount is negative, sometimes the amount being asked to be removed is more than the player has.
    // delta represents an adjusted amount which basically declares that a player cannot lose more resources
    // then they have.
    const playerAmount = this[resource];
    const delta = (amount >= 0) ? amount : Math.max(amount, -playerAmount);
    // Lots of calls to addResource used to deduct resources are done by cards and/or players stealing some
    // fixed amount which, if the current player doesn't have it. it just removes as much as possible.
    // (eg. Sabotage.) That's what the delta above, is for.
    //
    // But if the intent is to remove the amount requested (spending 8 plants to place a greenery) then there
    // better be 8 units. The code outside this call is responsible in those cases for making sure the player
    // has enough resource units to pay for an action.
    //
    // In those cases, if the player calls this, but the logic is wrong, the player could wind up with a
    // negative amount of units. This will break other actions in the game. So instead, this method deducts as
    // much as possible, and lots that there was a game error.
    //
    // The shortcut for knowing if this is the case is when `options.from` is undefined.
    if (delta !== amount && options?.from === undefined) {
      this.player.game.logIllegalState(
        `Adjusting ${amount} ${resource} when player has ${playerAmount}`,
        {player: {color: this.player.color, id: this.player.id, name: this.player.name}, resource, amount});
    }

    this[resource] += delta;

    if (options?.log === true) {
      this.logUnitDelta(resource, delta, /* production*/ false, options.from, options.stealing);
    }

    const from = options?.from;
    if (isFromPlayer(from)) {
      LawSuit.resourceHook(this.player, resource, delta, from.player);
      CrashSiteCleanup.resourceHook(this.player, resource, delta, from.player);
    }

    // Mons Insurance hook
    if (options?.from !== undefined && delta < 0 && (isFromPlayer(from) && from.player.id !== this.player.id)) {
      this.player.resolveInsurance();
    }
  }

  /**
   * `from` steals up to `qty` units of `resource` from this player. Or, at least as
   * much as possible.
   */
  public steal(resource: Resource, qty: number, thief: IPlayer, options?: {log?: boolean}) {
    const qtyToSteal = Math.min(this[resource], qty);
    if (qtyToSteal > 0) {
      this.deduct(resource, qtyToSteal, {log: options?.log ?? true, from: {player: thief}, stealing: true});
      thief.stock.add(resource, qtyToSteal);
    }
  }
}
