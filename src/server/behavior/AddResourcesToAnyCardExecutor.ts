import {asArray} from '@/common/utils/utils';
import {ICard} from '../cards/ICard';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {IPlayer} from '../IPlayer';
import {AddResource, Behavior} from './Behavior';
import {Counter} from './Counter';

export class AddResourcesToAnyCardExecutor {
  constructor(private player: IPlayer,
    private card: ICard,
    private behavior: Behavior,
    private ctx: Counter,
    private arctac: NonNullable<typeof behavior.addResourcesToAnyCard>) {
  }

  public canExecute() {
    const arctac = this.arctac;
    if (!Array.isArray(arctac) && arctac.mustHaveCard === true) {
      const action = this.createDeferredAction(arctac, this.ctx.count(arctac.count));
      const cards = action.getCards();
      if (cards.length === 0) {
        return false;
      }
      // Not playable if the behavior is based on spending a resource
      // from itself to add to itself, like Applied Science.
      if (cards.length === 1 && (this.behavior.spend?.resourcesHere ?? 0 > 0)) {
        // TODO(kberg): also check wither arctac.min + spend is enough.
        // but that's just to make this future-proof.
        if (cards[0]?.name === this.card.name) {
          return false;
        }
      }
    }

    return true;
  }

  private createDeferredAction(arctac: AddResource, count: number) {
    const filter = (target: ICard) => {
      if (arctac.excludeThis && target === this.card) {
        return false;
      }
      const min = arctac.min ?? 0;
      return target.resourceCount >= min;
    };
    return new AddResourcesToCard(
      this.player,
      arctac.type,
      {
        count,
        filter,
        restrictedTag: arctac.tag,
        robotCards: arctac.robotCards !== undefined,
      });
  }

  public execute() {
    const array = asArray(this.arctac);
    for (const arctac of array) {
      const count = this.ctx.count(arctac.count);
      if (count > 0) {
        this.player.game.defer(this.createDeferredAction(arctac, count));
      }
    }
  }
}
