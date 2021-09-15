import {ICard} from '../cards/ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Player} from '../Player';
import {SelectResources} from '../inputs/SelectResources';

export class GrantVenusAltTrackBonusDeferred implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
    public player: Player,
    public standardResourceCount: number,
    public wildResource: boolean,
  ) { }

  private newSelectResources(count: number) {
    return new SelectResources(
      this.player,
      count,
      `Gain ${count} resources for your Venus track bonus.`,
    );
  }
  public execute() {
    if (this.wildResource === false) {
      return this.newSelectResources(this.standardResourceCount);
    }

    const cards = this.player.getResourceCards(undefined);
    const card = new SelectCard('Add resource to card', 'Add resource', cards,
      (selected: Array<ICard>) => {
        this.player.addResourceTo(selected[0], {qty: 1, log: true});
        return undefined;
      },
    );
    const wild = new OrOptions(this.newSelectResources(1), card);
    wild.title = (this.standardResourceCount === 0) ?
      'Choose your wild resource bonus.':
      `Choose your wild resource bonus, after which you will gain ${this.standardResourceCount} more distinct standard resources.`;
    wild.cb = () => {
      return this.standardResourceCount > 0 ?
        this.newSelectResources(this.standardResourceCount) :
        undefined;
    };
    return wild;
  }
}
