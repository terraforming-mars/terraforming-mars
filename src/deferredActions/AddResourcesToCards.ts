import {DeferredAction, Priority} from './DeferredAction';
import {Player} from '../Player';
import {ResourceType} from '../common/ResourceType';
import {CardName} from '../common/cards/CardName';
import {SelectAmount} from '../inputs/SelectAmount';
import {AndOptions} from '../inputs/AndOptions';

export class AddResourcesToCards implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
    public player: Player,
    public resourceType: ResourceType,
    public count: number) {}

  public execute() {
    if (this.count === 0) {
      return undefined;
    }
    const cards = this.player.getResourceCards(this.resourceType);

    if (cards.length === 0) {
      return undefined;
    }
    if (cards.length === 1) {
      this.player.addResourceTo(cards[0], {qty: this.count, log: true});
      return undefined;
    }
    const map = new Map<CardName, number>();
    const options = cards.map((card) => {
      // Call back for the selectAmount. Store them in the map first, so
      // they can be counted and affirmed as enough.
      const cb = (amount: number) => {
        map.set(card.name, amount);
        return undefined;
      };

      return new SelectAmount(card.name, '', cb, 0, this.count);
    });

    return new AndOptions(() => {
      let sum = 0;
      cards.forEach((card) => {
        sum += map.get(card.name) ?? 0;
      });
      if (sum !== this.count) {
        throw new Error(`Expecting ${this.count} resources distributed, got ${sum}.`);
      }
      cards.forEach((card) => {
        const amount = map.get(card.name) ?? 0;
        if (amount > 0) {
          this.player.addResourceTo(card, {qty: amount, log: true});
        }
      });
      return undefined;
    }, ...options);
  }
}
