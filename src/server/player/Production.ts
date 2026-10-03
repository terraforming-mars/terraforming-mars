import {LawSuit} from '../cards/promo/LawSuit';
import {Resource} from '../../common/Resource';
import {From, isFromPlayer} from '../logs/From';
import {BaseStock} from './StockBase';
import {IPlayer} from '../IPlayer';
import {PRODUCTION_MINIMUMS} from '../../common/constants';

export class Production extends BaseStock {
  constructor(player: IPlayer) {
    super(player, PRODUCTION_MINIMUMS.megacredits);
  }
  public add(
    resource: Resource,
    amount : number,
    options? : { log: boolean, from? : From, stealing?: boolean},
  ) {
    const adj = PRODUCTION_MINIMUMS[resource];
    const delta = (amount >= 0) ? amount : Math.max(amount, -(this[resource] - adj));
    this[resource] += delta;

    if (options?.log === true) {
      this.logUnitDelta(resource, amount, /* production*/ true, options.from, options.stealing);
    }

    const from = options?.from;
    if (isFromPlayer(from)) {
      LawSuit.resourceHook(this.player, delta, from.player);

      // Mons Insurance hook
      if (delta < 0 && from.player.id !== this.player.id) {
        this.player.resolveInsurance();
      }
    }

    for (const card of this.player.tableau) {
      card.onProductionGain?.(this.player, resource, amount);
    }
  }
}
