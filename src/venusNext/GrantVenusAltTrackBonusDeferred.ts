import {ICard} from '../cards/ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {Units} from '../Units';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Player} from '../Player';
import {SelectDistinctResources} from '../inputs/SelectDistinctResources';

export class GrantVenusAltTrackBonusDeferred implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
    public player: Player,
    public standardResourceCount: number,
    public wildResource: boolean,
  ) { }

  private validate(units: Units, maximum: number) {
    const array = [units.megacredits, units.steel, units.titanium, units.plants, units.energy, units.heat];
    if (array.find((count) => count < 0)) {
      throw new Error('No units should be negative');
    }
    const sum = array.reduce((a, b) => a + b, 0);
    if (sum > maximum) {
      throw new Error(`Select no more than ${maximum} distinct units.`);
    }
  }

  private newDistinctResource(count: number) {
    return new SelectDistinctResources(
      count,
      this.player,
      (units: Units) => {
        this.validate(units, count);
        this.player.addUnits(units, {log: true});
        return undefined;
      },
      'Save',
    );
  }
  public execute() {
    if (this.wildResource === false) {
      return this.newDistinctResource(this.standardResourceCount);
    }

    const cards = this.player.getResourceCards(undefined);
    const card = new SelectCard('Add resource to card', 'Add resource', cards,
      (selected: Array<ICard>) => {
        this.player.addResourceTo(selected[0], {qty: 1, log: true});
        return undefined;
      },
    );
    const wild = new OrOptions(this.newDistinctResource(1), card);
    wild.title = (this.standardResourceCount === 0) ?
      'Choose your wild resource bonus.':
      `Choose your wild resource bonus, after which you will gain ${this.standardResourceCount} more distinct standard resources.`;
    wild.cb = () => {
      return this.standardResourceCount > 0 ?
        this.newDistinctResource(this.standardResourceCount) :
        undefined;
    };
    return wild;
  }
}
