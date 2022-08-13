import {ICard} from '../cards/ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Player} from '../Player';
import {SelectResources} from '../inputs/SelectResources';

export class GrantVenusAltTrackBonusDeferred extends DeferredAction {
  constructor(
    player: Player,
    public standardResourceCount: number,
    public wildResource: boolean,
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  private selectStandardResources(count: number) {
    return new SelectResources(
      this.player,
      count,
      `Gain ${count} resources for your Venus track bonus.`,
    );
  }

  public execute() {
    const resourceCards = this.player.getResourceCards(undefined);

    if (this.wildResource === false || resourceCards.length === 0) {
      return this.selectStandardResources(this.standardResourceCount);
    }

    const selectCard = new SelectCard('Add resource to card', 'Add resource', resourceCards,
      (selected: Array<ICard>) => {
        this.player.addResourceTo(selected[0], {qty: 1, log: true});
        return undefined;
      },
    );
    const wild = new OrOptions(selectCard, this.selectStandardResources(1));
    if (this.standardResourceCount > 0) {
      wild.cb = () => {
        return this.standardResourceCount > 0 ?
          this.selectStandardResources(this.standardResourceCount) :
          undefined;
      };
      wild.title = `Choose your wild resource bonus, after which you will gain ${this.standardResourceCount} more distinct standard resources.`;
    } else {
      wild.title = 'Choose your wild resource bonus.';
    }
    return wild;
  }
}
