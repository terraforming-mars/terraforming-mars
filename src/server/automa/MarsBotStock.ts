import {Stock} from '../player/Stock';
import {Production} from '../player/Production';
import {ALL_RESOURCES, Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {IPlayer} from '../IPlayer';
import {From} from '../logs/From';
import {MarsBot} from './MarsBot';

/**
 * Override Stock for MarsBot's player.
 *
 * Per rules (page 4):
 * - "Remove" resources → remove from MarsBot's MC supply
 * - "Steal" resources → take from MarsBot's MC supply as if they were the resource type
 *
 * All resource removals are converted to MC deductions from mcSupply.
 * Resource additions (from game engine bonuses) are ignored since MarsBot
 * doesn't use resources — MC is tracked separately in turnResolver.mcSupply.
 */
export class MarsBotStock extends Stock {
  private marsBotRef: MarsBot | undefined;

  constructor(player: IPlayer) {
    super(player);
  }

  public setMarsBot(marsBot: MarsBot): void {
    this.marsBotRef = marsBot;

    // Per automa rules, all MarsBot resources are its MC supply.
    // Cards check target.steel > 0 etc. to decide if stealing is possible.
    const stock = this;
    const mcProp = {
      get() { return stock.marsBotRef?.turnResolver.mcSupply ?? 0; },
      set() { /* no-op: MarsBotStock.add() handles mutations via mcSupply */ },
      configurable: true,
    };
    for (const resource of ALL_RESOURCES) {
      Object.defineProperty(this, resource, mcProp);
    }
  }

  /** MarsBot has mcSupply, not separate resource pools. */
  public override has(units: Units): boolean {
    const total = Units.values(units).reduce((a, b) => a + b, 0);
    return (this.marsBotRef?.turnResolver.mcSupply ?? 0) >= total;
  }

  /** MarsBot can adjust if mcSupply can cover the total cost. */
  public override canAdjust(units: Units): boolean {
    const cost = Units.values(units).reduce((sum, v) => sum + Math.min(0, v), 0);
    return (this.marsBotRef?.turnResolver.mcSupply ?? 0) + cost >= 0;
  }

  public override add(
    resource: Resource,
    amount: number,
    options?: {log?: boolean, from?: From, stealing?: boolean},
  ) {
    if (this.marsBotRef === undefined) {
      // Before MarsBot is wired up, fall through to normal behavior
      super.add(resource, amount, options);
      return;
    }

    if (amount < 0) {
      // Ecoline/Ecotec FAQ: plants on corp card can be targeted. Excess is lost, NOT from MC supply.
      if (resource === Resource.PLANTS && this.marsBotRef.corpSpecificState.has('plantResources')) {
        const plantResources = this.marsBotRef.corpSpecificState.get('plantResources') ?? 0;
        if (plantResources > 0) {
          const removed = Math.min(-amount, plantResources);
          this.marsBotRef.corpSpecificState.set('plantResources', plantResources - removed);
          if (options?.log) {
            this.player.game.log('MarsBot loses ${0} plant resources from corp card',
              (b) => b.number(removed));
          }
          return; // Plants from corp card — excess is lost, NOT from MC supply
        }
      }

      // All other resources → deduct from MC supply
      const mc = Math.min(-amount, this.marsBotRef.turnResolver.mcSupply);
      this.marsBotRef.turnResolver.mcSupply -= mc;

      if (options?.log) {
        this.player.game.log('MarsBot loses ${0} MC (${1} removed)',
          (b) => b.number(mc).rawString(resource));
      }
    }
    // Positive amounts (resource gains from placement bonuses etc.) are ignored
    // MarsBot gets MC from turnResolver.mcSupply via tile placement calculations
  }

  /**
   * Override steal: use mcSupply instead of actual resource count.
   * Per rules: "you may take the resources from MarsBot's MC supply
   * as if they were the resource type you are stealing."
   */
  public override steal(resource: Resource, qty: number, thief: IPlayer, options?: {log?: boolean}): void {
    if (this.marsBotRef === undefined) {
      super.steal(resource, qty, thief, options);
      return;
    }
    const qtyToSteal = Math.min(this.marsBotRef.turnResolver.mcSupply, qty);
    if (qtyToSteal > 0) {
      this.marsBotRef.turnResolver.mcSupply -= qtyToSteal;
      // Thief gains the actual resource type (plants, steel, etc.)
      thief.stock.add(resource, qtyToSteal);
      if (options?.log) {
        this.player.game.log('${0} steals ${1} ${2} from MarsBot (${3} MC deducted)',
          (b) => b.player(thief).number(qtyToSteal).rawString(resource).number(qtyToSteal));
      }
    }
  }
}

/**
 * Override Production for MarsBot's player.
 *
 * Per rules (page 4-5): "Decrease" production → regress corresponding track.
 * Production increases are ignored (MarsBot doesn't produce).
 */
export class MarsBotProduction extends Production {
  private marsBotRef: MarsBot | undefined;

  constructor(player: IPlayer) {
    super(player);
  }

  public setMarsBot(marsBot: MarsBot): void {
    this.marsBotRef = marsBot;
  }

  public override add(
    resource: Resource,
    amount: number,
    _options?: {log: boolean, from?: From, stealing?: boolean},
  ) {
    if (this.marsBotRef === undefined || amount >= 0) {
      // Ignore production increases; before wiring, fall through
      return;
    }

    // Production decrease → regress corresponding track
    for (let i = 0; i < -amount; i++) {
      this.marsBotRef.regressTrack(resource);
    }
  }
}
