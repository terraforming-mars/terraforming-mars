import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectCard} from '@/server/inputs/SelectCard';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {IPlayer} from '@/server/IPlayer';
import {GainResources} from '@/server/inputs/GainResources';

// TODO(kberg): Copied from GrantVenusAltTrackBonusDeferred, get these together.
export class GrantResourceDeferred extends DeferredAction {
  /**
   * @param wild when true, allows granting non-standard resources.
   */
  constructor(player: IPlayer, public wild: boolean = true) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    const options = new OrOptions();
    options.title = 'Choose your resource bonus';
    options.options.push(new GainResources(this.player, 1, 'Gain 1 standard resource.'));
    if (this.wild) {
      const cards = this.player.getResourceCards(undefined);
      if (cards.length > 0) {
        options.options.push(new SelectCard('Add resource to card', 'Add resource', this.player.getResourceCards(undefined))
          .andThen(([card]) => {
            this.player.addResourceTo(card, {qty: 1, log: true});
            return undefined;
          }));
      }
      if (options.process.length > 1) {
        options.title = 'Choose your wild resource bonus.';
      }
    }
    return options;
  }
}
