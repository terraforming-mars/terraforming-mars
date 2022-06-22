import {ICard} from '../cards/ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Player} from '../Player';
import {SelectResources} from '../inputs/SelectResources';

// TODO(kberg): Copied from GrantVenusAltTrackBonusDeferred, get these together.
export class GrantResourceDeferred extends DeferredAction {
  constructor(player: Player, public wild: boolean = true) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    const options = new OrOptions();
    options.title = 'Choose your resource bonus';
    options.options.push(new SelectResources(this.player, 1, 'Gain 1 standard resource.'));
    if (this.wild) {
      const cards = this.player.getResourceCards(undefined);
      if (cards.length > 0) {
        options.options.push(new SelectCard('Add resource to card', 'Add resource', this.player.getResourceCards(undefined),
          (selected: Array<ICard>) => {
            this.player.addResourceTo(selected[0], {qty: 1, log: true});
            return undefined;
          },
        ));
        options.title = 'Choose your wild resource bonus.';
      }
    }
    return options;
  }
}
